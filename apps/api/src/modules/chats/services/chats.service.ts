import { Injectable } from '@nestjs/common'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import path from 'path'
import fs from 'fs'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
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
import { ChatsEventsConsumerEnum } from '@/modules/chats/consumers/chats-events.consumer'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum, json } from 'shared'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { and, desc, eq, gt, cosineDistance, sql } from 'drizzle-orm'
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  ToolMessage,
} from '@langchain/core/messages'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LogActivity, LogLevelEnum } from 'utils'
import { ChatsFnsService } from '@/modules/chats/services/chats-fns.service'
import { getToolsFromToolDefs } from '@/utils/fns/get-tools-from-tool-defs'
import { UsersLlmToolsService } from '@/modules/users/services/users-llm-tools.service'
import { ToolExecsFnsService } from '@/modules/tool-execs/services/tool-execs-fns.service'
import { ToolExecsService } from '@/modules/tool-execs/services/tool-execs.service'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { GetLlmTool } from '@/types/tools/get-llm-tools'

@Injectable()
export class ChatsService {
  private prompts: Record<'systemBase', string>

  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    private readonly llmChatService: LlmChatService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly usersLlmToolsService: UsersLlmToolsService,
    @InjectQueue(QueueEnum.ChatsEvents)
    private readonly chatsEventsQueue: Queue,
    private readonly chatsFnsService: ChatsFnsService,
    private readonly toolExecsFnsService: ToolExecsFnsService,
    private readonly toolExecsService: ToolExecsService,
  ) {
    this.loadPrompts()
  }

  async chat(user: SelectUser, createChatDto: CreateChatDto) {
    const result = await this.chatsFnsService.createChat(user, createChatDto)

    const userToolDefs = this.usersLlmToolsService.getToolDefs()

    const toolDefs: GetLlmTool[] = [...userToolDefs]
    const tools: DynamicStructuredTool<any>[] = [
      ...getToolsFromToolDefs(userToolDefs),
    ]

    const [historicalChats] = await Promise.all([
      this.getChatHistory(user.userId, 5),
    ])

    let chatResponse = await this.llmChatService.chat(
      new HumanMessage(result[0].content),
      {
        history: [...historicalChats],
        systemPrompt: this.prompts.systemBase,
        tools,
      },
    )

    let chatEntityResult = await this.database.db
      .insert(Chats)
      .values({
        content: chatResponse?.content as string,
        type: ChatTypeEnum.Assistant,
        userId: user.userId,
      })
      .returning()
    // TODO: raw response vs natural language
    // TODO: if any other than confirmation tool is called, create in db and execute or not depending on `confirm` property of tool def
    // TODO: if no tool is called, default to returning plain response and answering the user's question
    // TODO: new table resources for chats/information via chats that would be considered good to store

    let toolExecResult
    if (chatResponse && this.toolExecsFnsService.hasToolCalls(chatResponse)) {
      console.log(
        'Has tool calls:',
        json(chatResponse.lc_kwargs.tool_calls.map((tool: any) => tool.name)),
      )

      toolExecResult = await this.toolExecsService.executeToolCall(
        chatResponse,
        result[0].chatId,
      )

      const chatToolEntityResult = await this.database.db
        .insert(Chats)
        .values({
          content: json(toolExecResult?.response) as string,
          type: ChatTypeEnum.Tool,
          userId: user.userId,
        })
        .returning()

      await this.database.db.insert(ChatsToToolExecs).values({
        chatId: chatToolEntityResult[0].chatId,
        toolExecId: toolExecResult.toolExecId,
      })

      const humanChat = new HumanMessage(createChatDto.message)

      const llmToolCall = new AIMessage({
        content: '',
        tool_calls: [toolExecResult.call],
      })

      const llmToolExecResult = new ToolMessage({
        content: JSON.stringify(toolExecResult.response),
        name: toolExecResult.name,
        tool_call_id: toolExecResult.call.id,
      })

      console.log('Tool execution result:', json(llmToolExecResult.content))

      chatResponse = await this.llmChatService.chat(llmToolExecResult, {
        history: [humanChat, llmToolCall],
        systemPrompt: this.prompts.systemBase,
      })

      chatEntityResult = await this.database.db
        .insert(Chats)
        .values({
          content: chatResponse?.content as string,
          type: ChatTypeEnum.Assistant,
          userId: user.userId,
        })
        .returning()
    }

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Chat,
          entityIds: chatEntityResult.map((entity) => entity.chatId),
          dataChange: {
            newValue: chatEntityResult,
          },
          action: EventActionEnum.Create,
        },
      }),
    )

    await this.chatsEventsQueue.add(
      ChatsEventsConsumerEnum.CreateChatsEmbedding,
      chatEntityResult[0],
    )

    return {
      chatId: result[0].chatId,
      message: chatEntityResult[0].content,
      data: toolExecResult?.response,
    }
  }

  @LogActivity({ level: LogLevelEnum.DEBUG })
  private async getChatHistory(userId: number, limit = 3) {
    const chats = await this.database.db
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

    console.log('Historical chats:', json(chats.map((chat) => chat)))

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
