import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import path from 'path'
import fs from 'fs'
import { ChatTypeEnum, SelectConversation, SelectUser } from 'database'
import { json } from 'shared'
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages'
import { LogActivity, LogLevelEnum } from 'utils'
import { ChatsFnsService } from '@/modules/chats/services/chats-fns.service'
import { getToolsFromToolDefs } from '@/utils/fns/get-tools-from-tool-defs'
import { ToolExecsFnsService } from '@/modules/tool-execs/services/tool-execs-fns.service'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { ToolExecsHandlingService } from '@/modules/tool-execs/services/tool-execs-handling.service'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import { ChatsQueryService } from '@/modules/chats/services/queries/chats-query.service'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'
import { ConversationDto } from '@/modules/chats/dtos/conversation.dto'
import { ToolExecsLlmToolsService } from '@/modules/tool-execs/services/tool-execs-llm-tools.service'
import { LlmRagService } from '@/core/llm/services/llm-rag.service'
import { ConvsQueryService } from '@/modules/chats/services/queries/convs-query.service'
import { AppRequestInterface } from '@/types/app-request.interface'

@Injectable()
export class ChatsLlmService {
  private prompts: Record<LlmConversationTypeEnum, string>

  constructor(
    private readonly llmChatService: LlmChatService,
    private readonly chatsFnsService: ChatsFnsService,
    private readonly chatsQueryService: ChatsQueryService,
    private readonly toolExecsFnsService: ToolExecsFnsService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly toolExecsHandlingService: ToolExecsHandlingService,
    private readonly toolExecsLlmToolsService: ToolExecsLlmToolsService,
    private readonly llmRagService: LlmRagService,
    private readonly convsQueryService: ConvsQueryService,
  ) {
    this.loadPrompts()
  }

  // Business rules:
  // Create a new conversation
  // Create a chat record with the user's query
  // Create an embedding for the query and store that in the embeddings table
  // Send an event that the user data has been updated with the new chat record
  // Get the tool definitions and add them into the chat
  // Get the historical chats for the user and add them into chat history
  // Send the chat query to the LLM chat service
  // Create a new chat record with the AI response
  // If the response has tool calls:
  // - Create a tool execution record in the tool execs table and link it to the AI chat record
  // - Execute the tool call and store the response in the tool execs table, of the previously created record
  // - Create a new tool chat record which links to the same tool execution record
  // - Get latest historical chats for the user and add them into chat history
  // - Send the tool response to the LLM chat service
  // - Store the AI response in the chat table
  // Get the most recent chat response from the database
  // Return the most recent response in the database as well as (if applicable) the tool execution response
  // If any call fails, delete relevant chat record so that we don't get 400 error 'tool_calls' must be followed by tool messages + return friendly message based off of this
  async chat(
    user: Pick<SelectUser, 'userId'>,
    convDto: ConversationDto,
    request: AppRequestInterface,
  ) {
    // Create a new conversation
    // Create a chat record with the user's query
    // Create an embedding for the query and store that in the embeddings table
    // Send an event that the user data has been updated with the new chat record
    const { convType } = convDto
    const conv = await this.chatsQueryService.createConv(
      user.userId,
      convDto.convType,
    )

    const [result, embeddings] = await Promise.all([
      this.chatsFnsService.createChat(
        user,
        conv.convId,
        {
          content: convDto.message,
          type: convDto.chatType,
        },
        true,
      ),
      this.llmEmbeddingsService.generateEmbeddings([convDto.message]),
    ])

    // Get the tool definitions and add them into the chat
    const resourceToolDefs = this.toolExecsLlmToolsService.getToolDefs(convType)
    const tools: DynamicStructuredTool<any>[] =
      getToolsFromToolDefs(resourceToolDefs)

    // Get the historical chats for the user and add them into chat history as well as relevant context
    const [historicalChats, relevantContext] = await Promise.all([
      this.getChatHistory(user.userId, convType),
      this.rag(embeddings[0], user.userId, convType, request),
    ])

    // Send the chat query to the LLM chat service
    const chatResponse = await this.llmChatService.chat(
      new HumanMessage(result[0].content),
      {
        history: [...relevantContext, ...historicalChats],
        systemPrompt: this.prompts[convType],
        tools,
      },
    )

    // Create a new chat record with the AI response
    const createChatResponseResult = await this.chatsFnsService.createChat(
      user,
      conv.convId,
      {
        content: chatResponse?.content as string,
        type: ChatTypeEnum.Assistant,
      },
    )

    let toolExecResponse
    if (chatResponse && this.toolExecsFnsService.hasToolCalls(chatResponse)) {
      toolExecResponse = await this.toolExecsHandlingService.handleToolExec({
        chatResponse,
        toolDefs: resourceToolDefs,
        convId: conv.convId,
        chatId: createChatResponseResult[0].chatId,
      })

      await this.createToolExecResponse(user, conv, tools, relevantContext)
    }
    // Get the most recent chat response from the database
    const mostRecentChatResponses = await this.getMostRecentChatsFromDb(
      user.userId,
      convType,
      1,
    )
    // Return the most recent response in the database as well as (if applicable) the tool execution response

    return {
      convId: conv.convId,
      chatId: mostRecentChatResponses.at(-1)?.chatId,
      message: mostRecentChatResponses.at(-1)?.content,
      data: toolExecResponse,
    }
  }

  private async createToolExecResponse(
    user: Pick<SelectUser, 'userId'>,
    conv: Pick<SelectConversation, 'convId' | 'type'>,
    tools: GetLlmTool['tool'][],
    relevantContext: SystemMessage[],
  ) {
    // - Get latest historical chats for the user and add them into chat history
    const historicalChats = await this.getChatHistory(
      user.userId,
      conv.type as any,
    )

    // - Send the tool response to the LLM chat service
    const lastChat = historicalChats.at(-1)
    if (!lastChat) {
      throw new InternalServerErrorException(
        'No last chat found from historical chats.',
      )
    }

    console.log('tool chat response', json(lastChat))
    const chatToolResponse = await this.llmChatService.chat(lastChat, {
      history: [...relevantContext, ...historicalChats.slice(0, -1)],
      systemPrompt: this.prompts[conv.type],
      tools,
    })

    // - Store the AI response in the chat table
    await this.chatsFnsService.createChat(user, conv.convId, {
      content: chatToolResponse?.content as string,
      type: ChatTypeEnum.Assistant,
    })
  }

  @LogActivity({ level: LogLevelEnum.DEBUG })
  private async getChatHistory(
    userId: number,
    convType: LlmConversationTypeEnum,
    limit = 3,
  ) {
    const chats = await this.getMostRecentChatsFromDb(userId, convType, limit)

    return chats
      .map((chat) =>
        this.getMessageInstanceFromChatType(chat.type, {
          content: chat.content,
          toolExecResponse: JSON.stringify(chat.toolExecResponse),
          toolExecData: chat.toolExecData,
        }),
      )
      .filter(Boolean) as BaseMessage[]
  }

  private async getMostRecentChatsFromDb(
    userId: number,
    convType: LlmConversationTypeEnum,
    limit?: number,
  ) {
    const recentConversations = await this.convsQueryService.recentConvs(
      userId,
      convType,
      limit,
    )

    const conversationsWithChats = await Promise.all(
      recentConversations.map(async (conv) => {
        return this.convsQueryService.chatsByConvId(conv.convId)
      }),
    )

    return conversationsWithChats
      .flat()
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  @LogActivity({ level: LogLevelEnum.DEBUG, logEntry: false })
  private async rag(
    embedding: number[],
    userId: number,
    convType: LlmConversationTypeEnum,
    request: any,
  ) {
    const resourcesCtx = await this.llmRagService.getRelevantResources(
      embedding,
      userId,
      convType,
    )

    const ipAddress =
      request?.ip ||
      request?.headers?.['x-forwarded-for'] ||
      request?.connection?.remoteAddress

    const timezone = request?.headers?.['x-timezone']
    const location = request?.headers?.['x-location']

    const localTime = timezone
      ? new Date().toLocaleString('en-US', { timeZone: timezone })
      : undefined

    const userCtx = await this.llmRagService.getUserData(userId, {
      timezone,
      localTime,
      location,
      ipAddress,
    })

    return [
      new SystemMessage(
        `If applicable and relevant to user's query, here is the user's context: ${userCtx}`,
      ),
      new SystemMessage(
        `If applicable, use the following resources to answer's the user's questions: ${resourcesCtx}`,
      ),
    ]
  }

  private getMessageInstanceFromChatType(
    chatType: ChatTypeEnum,
    context: {
      content: string
      toolExecResponse?: string
      toolExecData?: any
    },
  ) {
    const { content, toolExecResponse, toolExecData } = context
    switch (chatType) {
      case ChatTypeEnum.Assistant:
        return new AIMessage({
          content,
          tool_calls: toolExecData ? [toolExecData] : [],
        })
      case ChatTypeEnum.Tool:
        return new ToolMessage({
          content: toolExecResponse ?? '',
          tool_call_id: toolExecData.id,
          name: toolExecData.name,
        })
      case ChatTypeEnum.Human:
        return new HumanMessage(content)
      default:
        console.error('Invalid chat type, skipping from history:', chatType)
    }
  }

  private loadPrompts() {
    const getSystemFilePath = (fileName: string) => {
      const basePath = path.join(__dirname, '../prompts/system')
      return path.join(basePath, fileName)
    }

    const personalPrompt = fs.readFileSync(
      getSystemFilePath('base-personal.txt'),
      'utf8',
    )
    const workPrompt = fs.readFileSync(
      getSystemFilePath('base-work.txt'),
      'utf8',
    )
    const apiPrompt = fs.readFileSync(getSystemFilePath('base-api.txt'), 'utf8')
    this.prompts = {
      [LlmConversationTypeEnum.Personal]: personalPrompt,
      [LlmConversationTypeEnum.Work]: workPrompt,
      [LlmConversationTypeEnum.Api]: apiPrompt,
    }
  }
}
