import { Injectable } from '@nestjs/common'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import path from 'path'
import fs from 'fs'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { DatabaseService } from '@/core/database/database.service'
import { Chats, ChatTypeEnum, SelectUser } from 'database'
import { CreateChatsDto } from '@/modules/chats/dtos/create-chat.dto'
import { ChatsEventsConsumerEnum } from '@/modules/chats/consumers/chats-events.consumer'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum } from 'shared'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ChatsService {
  private prompts: Record<'systemBase', string>

  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    private readonly llmChatService: LlmChatService,
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

    const response = await this.llmChatService.chat(result[0].content, {
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

    await this.chatsEventsQueue.add(
      ChatsEventsConsumerEnum.CreateChatsEmbedding,
      responseResult[0],
    )

    return response
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
