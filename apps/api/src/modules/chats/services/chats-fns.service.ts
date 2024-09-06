import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { Chats, SelectChat, SelectUser } from 'database'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum } from 'shared'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ChatTypeEnum } from '@/patch/enums/external'
import { CreateEventChatCreatedDto } from '@/modules/chats/dtos/events/create-event-chat-created.dto'

@Injectable()
export class ChatsFnsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
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
      this.eventEmitter.emit(
        EventsEnum.ChatCreated,
        new CreateEventChatCreatedDto({ data: result[0] }),
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
