import { Injectable } from '@nestjs/common'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import path from 'path'
import fs from 'fs'
import { DatabaseService } from '@/core/database/database.service'
import {
  Chats,
  ChatsToToolExecs,
  ChatTypeEnum,
  Embeddings,
  SelectUser,
  ToolExecs,
} from 'database'
import { CreateChatDto } from '@/modules/chats/dtos/create-chat.dto'
import { json } from 'shared'
import { and, desc, eq, gt, cosineDistance, sql } from 'drizzle-orm'
import {
  AIMessage,
  BaseMessage,
  BaseMessageChunk,
  HumanMessage,
  ToolMessage,
} from '@langchain/core/messages'
import { LogActivity, LogLevelEnum } from 'utils'
import { ChatsFnsService } from '@/modules/chats/services/chats-fns.service'
import { getToolsFromToolDefs } from '@/utils/fns/get-tools-from-tool-defs'
import { UsersLlmToolsService } from '@/modules/users/services/users-llm-tools.service'
import { ToolExecsFnsService } from '@/modules/tool-execs/services/tool-execs-fns.service'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { ToolExecStatus } from '@/patch/enums/external'
import { GetLlmTool } from '@/types/tools/get-llm-tools'

@Injectable()
export class ChatsService {
  private prompts: Record<'systemBase', string>

  constructor(
    private readonly database: DatabaseService,
    private readonly llmChatService: LlmChatService,
    private readonly usersLlmToolsService: UsersLlmToolsService,
    private readonly chatsFnsService: ChatsFnsService,
    private readonly toolExecsFnsService: ToolExecsFnsService,
  ) {
    this.loadPrompts()
  }

  // Business rules:
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
  async chat(user: SelectUser, createChatDto: CreateChatDto) {
    // Create a chat record with the user's query
    // Create an embedding for the query and store that in the embeddings table
    // Send an event that the user data has been updated with the new chat record
    const result = await this.chatsFnsService.createChat(
      user,
      {
        content: createChatDto.message,
        type: createChatDto.type,
      },
      true,
    )

    // Get the tool definitions and add them into the chat
    const userToolDefs = this.usersLlmToolsService.getToolDefs()
    const tools: DynamicStructuredTool<any>[] =
      getToolsFromToolDefs(userToolDefs)

    // Get the historical chats for the user and add them into chat history
    const historicalChats = await this.getChatHistory(user.userId, 5)

    // Send the chat query to the LLM chat service
    const chatResponse = await this.llmChatService.chat(
      new HumanMessage(result[0].content),
      {
        history: historicalChats,
        systemPrompt: this.prompts.systemBase,
        tools,
      },
    )

    // Create a new chat record with the AI response
    const createChatResponseResult = await this.chatsFnsService.createChat(
      user,
      {
        content: chatResponse?.content as string,
        type: ChatTypeEnum.Assistant,
      },
    )

    let toolExecResponse
    if (chatResponse && this.toolExecsFnsService.hasToolCalls(chatResponse)) {
      toolExecResponse = await this.handleToolCalling(
        chatResponse,
        userToolDefs,
        user.userId,
        createChatResponseResult[0].chatId,
      )

      // - Get latest historical chats for the user and add them into chat history
      const historicalChats = await this.getChatHistory(user.userId, 5)

      // - Send the tool response to the LLM chat service
      console.log('tool chat response', json(historicalChats.at(0)))
      const chatToolResponse = await this.llmChatService.chat(
        historicalChats.at(0),
        {
          history: historicalChats.slice(0),
          systemPrompt: this.prompts.systemBase,
          tools,
        },
      )

      // - Store the AI response in the chat table
      await this.chatsFnsService.createChat(user, {
        content: chatToolResponse?.content as string,
        type: ChatTypeEnum.Assistant,
      })
    }
    // Get the most recent chat response from the database
    const mostRecentChatResponses = await this.getMostRecentChatsFromDb(
      user.userId,
      1,
    )
    // Return the most recent response in the database as well as (if applicable) the tool execution response

    return {
      chatId: mostRecentChatResponses[0].chatId,
      message: mostRecentChatResponses[0].content,
      data: toolExecResponse,
    }
  }

  @LogActivity()
  async handleToolCalling(
    chatResponse: BaseMessageChunk,
    toolDefs: GetLlmTool[],
    userId: number,
    chatId: number,
  ) {
    const toolCall = this.toolExecsFnsService.getCalledTool(chatResponse)

    if (!toolCall) {
      throw new Error('No tool call found.')
    }

    const toolDef = toolDefs.find((def) => def.tool.name === toolCall.name)

    if (!toolDef) {
      throw new Error('Tool not found.')
    }

    const { tool } = toolDef

    // - Create a tool execution record in the tool execs table and link it to the AI chat record
    const createToolExecResult = await this.database.db
      .insert(ToolExecs)
      .values({
        toolName: tool.name,
        executionData: toolCall,
        status: ToolExecStatus.Approved,
      })
      .returning()

    await this.database.db.insert(ChatsToToolExecs).values({
      chatId,
      toolExecId: createToolExecResult[0].toolExecId,
    })

    // - Execute the tool call and store the response in the tool execs table, of the previously created record
    const toolResponse = await tool.func(toolCall.args)
    await this.database.db
      .update(ToolExecs)
      .set({
        status: ToolExecStatus.Executed,
        executedAt: new Date(),
        response: toolResponse,
      })
      .where(eq(ToolExecs.toolExecId, createToolExecResult[0].toolExecId))

    // - Create a new tool chat record which links to the same tool execution record
    const createToolChatResult = await this.database.db
      .insert(Chats)
      .values({
        content: json(toolResponse) as string,
        type: ChatTypeEnum.Tool,
        userId: userId,
      })
      .returning()

    await this.database.db.insert(ChatsToToolExecs).values({
      chatId: createToolChatResult[0].chatId,
      toolExecId: createToolExecResult[0].toolExecId,
    })

    return toolResponse
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
    return this.database.db
      .select({
        content: Chats.content,
        type: Chats.type,
        chatId: Chats.chatId,
        toolExecData: ToolExecs.executionData,
        toolExecResponse: ToolExecs.response,
      })
      .from(Chats)
      .leftJoin(ChatsToToolExecs, eq(ChatsToToolExecs.chatId, Chats.chatId))
      .leftJoin(
        ToolExecs,
        eq(ToolExecs.toolExecId, ChatsToToolExecs.toolExecId),
      )
      .where(and(eq(Chats.userId, userId)))
      .orderBy(desc(Chats.createdAt))
      .limit(limit)
  }

  @LogActivity({ level: LogLevelEnum.DEBUG, logEntry: false })
  private async getRelevantChats(
    embedding: number[],
    userId: number,
    limit = 2,
    minSimilarity = 0.3,
  ) {
    const similarity = sql<number>`1 - (${cosineDistance(
      Embeddings.embedding,
      embedding,
    )})`

    const chats = await this.database.db
      .select({ similarity, content: Chats.content, type: Chats.type })
      .from(Embeddings)
      .innerJoin(Chats, eq(Embeddings.chatId, Chats.chatId))
      .where(and(eq(Chats.userId, userId), gt(similarity, minSimilarity)))
      .orderBy((t) => desc(t.similarity))
      .limit(limit)

    return chats
      .map((chat) =>
        this.getMessageInstanceFromChatType(chat.type, {
          content: chat.content,
        }),
      )
      .filter(Boolean) as BaseMessage[]
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
