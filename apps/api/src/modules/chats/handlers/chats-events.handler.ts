import { ChatsEmbeddingsService } from '@/modules/chats/services/chats-embeddings.service'
import { LogActivity } from 'utils'
import { OnEvent } from '@nestjs/event-emitter'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventChatCreatedDto } from '@/modules/chats/dtos/events/create-event-chat-created.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChatsEventsHandler {
  constructor(
    private readonly chatsEmbeddingsService: ChatsEmbeddingsService,
  ) {}

  @OnEvent(EventsEnum.ChatCreated, { async: true })
  @LogActivity()
  async handleCreateChatEvent(event: CreateEventChatCreatedDto) {
    return await this.chatsEmbeddingsService.generateAndSaveEmbeddings(
      event.data,
    )
  }
}
