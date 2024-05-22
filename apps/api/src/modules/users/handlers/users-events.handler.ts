import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { CreateEventUserCreatedDto } from '@/core/events/dtos/create-event-user-created.dto'
import { EventsEnum } from '@/core/events/types/events.enum'
import { QueueEnum } from '@/types/queues/queue.enum'
import { UserEventsConsumerEnum } from '@/modules/users/consumers/users-events.consumer'
import { LogActivity } from 'utils'

@Injectable()
export class UsersEventsHandler {
  constructor(
    @InjectQueue(QueueEnum.UserEvents) private readonly userEventsQueue: Queue,
  ) {}

  @OnEvent(EventsEnum.UserCreated)
  @LogActivity()
  async handleUserCreatedEvent(event: CreateEventUserCreatedDto) {
    await Promise.all([
      this.userEventsQueue.add(
        UserEventsConsumerEnum.SendWelcomeEmail,
        event.user,
      ),
      this.userEventsQueue.add(
        UserEventsConsumerEnum.CreateUserEmbedding,
        event.user,
      ),
      this.userEventsQueue.add(
        UserEventsConsumerEnum.StoreUserCreatedEvent,
        event,
      ),
    ])
  }
}
