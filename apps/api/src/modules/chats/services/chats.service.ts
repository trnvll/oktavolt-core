import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import path from 'path'
import fs from 'fs'
import { DatabaseService } from '@/core/database/database.service'
import {
  Chats,
  ChatsToToolExecs,
  ChatTypeEnum,
  Conversations,
  SelectUser,
  ToolExecs,
} from 'database'
import { CreateChatDto } from '@/modules/chats/dtos/create-chat.dto'
import { json } from 'shared'
import { desc, eq, asc } from 'drizzle-orm'
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
import { ResourcesLlmToolsService } from '@/modules/resources/services/resources-llm-tools.service'
import { ResourcesQueryService } from '@/modules/resources/services/resources-query.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { ToolExecsHandlingService } from '@/modules/tool-execs/services/tool-execs-handling.service'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import { ChatsQueryService } from '@/modules/chats/services/chats-query.service'

@Injectable()
export class ChatsService {
  private prompts: Record<'systemBase', string>

  constructor(
    private readonly database: DatabaseService,
    private readonly llmChatService: LlmChatService,
    private readonly resourcesLlmToolsService: ResourcesLlmToolsService,
    private readonly resourcesQueryService: ResourcesQueryService,
    private readonly chatsFnsService: ChatsFnsService,
    private readonly chatsQueryService: ChatsQueryService,
    private readonly toolExecsFnsService: ToolExecsFnsService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly toolExecsHandlingService: ToolExecsHandlingService,
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
  async chat(user: SelectUser, createChatDto: CreateChatDto) {
    // Create a new conversation
    // Create a chat record with the user's query
    // Create an embedding for the query and store that in the embeddings table
    // Send an event that the user data has been updated with the new chat record
    const convId = await this.chatsQueryService.createConv(user.userId)

    const [result, embeddings] = await Promise.all([
      this.chatsFnsService.createChat(
        user,
        convId,
        {
          content: createChatDto.message,
          type: createChatDto.type,
        },
        true,
      ),
      this.llmEmbeddingsService.generateEmbeddings([createChatDto.message]),
    ])

    // Get the tool definitions and add them into the chat
    const resourceToolDefs = this.resourcesLlmToolsService.getToolDefs()
    const tools: DynamicStructuredTool<any>[] =
      getToolsFromToolDefs(resourceToolDefs)

    // Get the historical chats for the user and add them into chat history as well as relevant context
    const [historicalChats, relevantContext] = await Promise.all([
      this.getChatHistory(user.userId),
      this.getRelevantResources(embeddings[0], user.userId),
    ])

    // Send the chat query to the LLM chat service
    const chatResponse = await this.llmChatService.chat(
      new HumanMessage(result[0].content),
      {
        history: [relevantContext, ...historicalChats],
        systemPrompt: this.prompts.systemBase,
        tools,
      },
    )

    // Create a new chat record with the AI response
    const createChatResponseResult = await this.chatsFnsService.createChat(
      user,
      convId,
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
        convId,
        chatId: createChatResponseResult[0].chatId,
      })

      await this.createToolExecResponse(user, convId, tools)
    }
    // Get the most recent chat response from the database
    const mostRecentChatResponses = await this.getMostRecentChatsFromDb(
      user.userId,
      1,
    )
    // Return the most recent response in the database as well as (if applicable) the tool execution response

    return {
      convId: convId,
      chatId: mostRecentChatResponses.at(-1)?.chatId,
      message: mostRecentChatResponses.at(-1)?.content,
      data: toolExecResponse,
    }
  }

  private async createToolExecResponse(
    user: SelectUser,
    convId: number,
    tools: GetLlmTool['tool'][],
  ) {
    // - Get latest historical chats for the user and add them into chat history
    const historicalChats = await this.getChatHistory(user.userId)

    // - Send the tool response to the LLM chat service
    const lastChat = historicalChats.at(-1)
    if (!lastChat) {
      throw new InternalServerErrorException(
        'No last chat found from historical chats.',
      )
    }

    console.log('tool chat response', json(lastChat))
    const chatToolResponse = await this.llmChatService.chat(lastChat, {
      history: historicalChats.slice(0, -1),
      systemPrompt: this.prompts.systemBase,
      tools,
    })

    // - Store the AI response in the chat table
    await this.chatsFnsService.createChat(user, convId, {
      content: chatToolResponse?.content as string,
      type: ChatTypeEnum.Assistant,
    })
  }

  @LogActivity({ level: LogLevelEnum.DEBUG })
  private async getChatHistory(userId: number, limit = 3) {
    const chats = await this.getMostRecentChatsFromDb(userId, limit)

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

  private async getMostRecentChatsFromDb(userId: number, limit = 3) {
    const recentConversations = await this.database.db
      .select({
        convId: Conversations.convId,
        createdAt: Conversations.createdAt,
      })
      .from(Conversations)
      .where(eq(Conversations.userId, userId))
      .orderBy(desc(Conversations.createdAt))
      .limit(limit)

    const conversationsWithChats = await Promise.all(
      recentConversations.map(async (conv) => {
        const chats = await this.database.db
          .select({
            content: Chats.content,
            type: Chats.type,
            chatId: Chats.chatId,
            toolExecData: ToolExecs.executionData,
            toolExecResponse: ToolExecs.response,
            createdAt: Chats.createdAt,
          })
          .from(Chats)
          .leftJoin(ChatsToToolExecs, eq(ChatsToToolExecs.chatId, Chats.chatId))
          .leftJoin(
            ToolExecs,
            eq(ToolExecs.toolExecId, ChatsToToolExecs.toolExecId),
          )
          .where(eq(Chats.convId, conv.convId))
          .orderBy(asc(Chats.createdAt))

        return chats
      }),
    )

    return conversationsWithChats
      .flat()
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  @LogActivity({ level: LogLevelEnum.DEBUG, logEntry: false })
  private async getRelevantResources(
    embedding: number[],
    userId: number,
    limit = 2,
    minSimilarity = 0.3,
  ) {
    const resources = await this.resourcesQueryService.findSimilarResources(
      embedding,
      userId,
      { limit, minSimilarity },
    )

    const context = resources.map((resource) => resource.content).join('\n')

    return new SystemMessage(
      `If applicable, use the following context to answer the user's questions: ${context}`,
    )
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

    const systemBasePrompt = fs.readFileSync(
      getSystemFilePath('base.txt'),
      'utf8',
    )
    this.prompts = {
      systemBase: systemBasePrompt,
    }
  }
}
