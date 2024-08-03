import { Injectable } from '@nestjs/common'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import path from 'path'
import fs from 'fs'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { DatabaseService } from '@/core/database/database.service'
import { Chats, ChatTypeEnum, Embeddings, SelectUser } from 'database'
import { CreateChatsDto } from '@/modules/chats/dtos/create-chat.dto'
import { ChatsEventsConsumerEnum } from '@/modules/chats/consumers/chats-events.consumer'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum } from 'shared'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { and, desc, eq, gt, or, cosineDistance, sql } from 'drizzle-orm'
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LogActivity, LogLevelEnum } from 'utils'

@Injectable()
export class ChatsService {
  private prompts: Record<'systemBase', string>

  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    private readonly llmChatService: LlmChatService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    @InjectQueue(QueueEnum.ChatsEvents)
    private readonly chatsEventsQueue: Queue,
  ) {
    this.loadPrompts()
  }

  async chat(user: SelectUser, createChatsDto: CreateChatsDto) {
    const entities = CreateChatsDto.toEntity(user.userId, createChatsDto.data)

    const result = await this.database.db
      .insert(Chats)
      .values(entities)
      .returning()

    await this.chatsEventsQueue.add(
      ChatsEventsConsumerEnum.CreateChatsEmbedding,
      result[0],
    )

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Chat,
          entityIds: result.map((entity) => entity.chatId),
          dataChange: {
            newValue: result,
          },
          action: EventActionEnum.Create,
        },
      }),
    )

    const embedding = await this.llmEmbeddingsService.generateEmbeddings([
      result[0].content,
    ])

    const [historicalChats, relevantChats] = await Promise.all([
      this.getChatHistory(user.userId),
      this.getRelevantChats(embedding[0], user.userId),
    ])

    const response = await this.llmChatService.chat(result[0].content, {
      history: [...historicalChats, ...relevantChats],
      systemPrompt: this.prompts.systemBase,
    })

    const responseResult = await this.database.db
      .insert(Chats)
      .values({
        content: response,
        type: ChatTypeEnum.Assistant,
        userId: user.userId,
      })
      .returning()

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Chat,
          entityIds: responseResult.map((entity) => entity.chatId),
          dataChange: {
            newValue: responseResult,
          },
          action: EventActionEnum.Create,
        },
      }),
    )

    await this.chatsEventsQueue.add(
      ChatsEventsConsumerEnum.CreateChatsEmbedding,
      responseResult[0],
    )

    return response
  }

  @LogActivity({ level: LogLevelEnum.DEBUG })
  private async getChatHistory(userId: number, limit = 3) {
    const chats = await this.database.db.query.chats.findMany({
      where: and(
        eq(Chats.userId, userId),
        or(
          eq(Chats.type, ChatTypeEnum.Human),
          eq(Chats.type, ChatTypeEnum.Assistant),
        ),
      ),
      orderBy: [desc(Chats.createdAt)],
      limit,
    })

    return chats
      .map((chat) =>
        this.getMessageInstanceFromChatType(chat.content, chat.type),
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
        this.getMessageInstanceFromChatType(chat.content, chat.type),
      )
      .filter(Boolean) as BaseMessage[]
  }

  private getMessageInstanceFromChatType(
    content: string,
    chatType: ChatTypeEnum,
  ) {
    switch (chatType) {
      case ChatTypeEnum.Assistant:
        return new AIMessage(content)
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
