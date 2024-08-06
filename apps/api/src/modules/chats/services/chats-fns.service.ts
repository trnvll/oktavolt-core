import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { DatabaseService } from '@/core/database/database.service'
import { CreateChatDto } from '@/modules/chats/dtos/create-chat.dto'
import { Chats, SelectUser } from 'database'
import { ChatsEventsConsumerEnum } from '@/modules/chats/consumers/chats-events.consumer'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum } from 'shared'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ChatsFnsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(QueueEnum.ChatsEvents)
    private readonly chatsEventsQueue: Queue,
  ) {}

  async createChat(user: SelectUser, createChatDto: CreateChatDto) {
    const entity = CreateChatDto.toEntity(user.userId, createChatDto)

    const result = await this.database.db
      .insert(Chats)
      .values(entity)
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

    return result
  }
}
