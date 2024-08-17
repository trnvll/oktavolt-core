import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { DatabaseService } from '@/core/database/database.service'
import { Chats, SelectChat, SelectUser } from 'database'
import { ChatsEventsConsumerEnum } from '@/modules/chats/consumers/chats-events.consumer'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum } from 'shared'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ChatTypeEnum } from '@/patch/enums/external'

@Injectable()
export class ChatsFnsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(QueueEnum.ChatsEvents)
    private readonly chatsEventsQueue: Queue,
  ) {}

  async createChat(
    user: Pick<SelectUser, 'userId'>,
    convId: number,
    createChatDto: {
      content: string
      type: ChatTypeEnum
    },
    createEvent = false,
  ) {
    const result = await this.database.db
      .insert(Chats)
      .values({
        content: createChatDto.content,
        type: createChatDto.type,
        convId,
      })
      .returning()

    if (createChatDto.content.length) {
      await this.chatsEventsQueue.add(
        ChatsEventsConsumerEnum.CreateChatsEmbedding,
        result[0],
      )
    }

    if (createEvent) {
      this.createUserDataUpdatedEvent(user, result[0])
    }

    return result
  }

  createUserDataUpdatedEvent(
    user: Pick<SelectUser, 'userId'>,
    chat: SelectChat,
  ) {
    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Chat,
          entityIds: [chat.chatId],
          dataChange: {
            newValue: chat,
          },
          action: EventActionEnum.Create,
        },
      }),
    )
  }
}
