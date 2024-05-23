import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import {
  CreateEventUserCreatedDto,
  CreateEventUserCreatedJob,
} from '@/core/events/dtos/create-event-user-created.dto'
import { EventsEnum } from '@/core/events/types/events.enum'
import { QueueEnum } from '@/types/queues/queue.enum'
import { UserEventsConsumerEnum } from '@/modules/users/consumers/users-events.consumer'
import { LogActivity } from 'utils'
import { CreateEventUserDeletedDto } from '@/core/events/dtos/create-event-user-deleted.dto'
import {
  CreateEventUserDataUpdatedDto,
  CreateEventUserDataUpdatedJob,
} from '@/core/events/dtos/create-event-user-data-updated.dto'
import { DatabaseService } from '@/core/database/database.service'
import { eq } from 'drizzle-orm'
import { Users } from 'database'

@Injectable()
export class UsersEventsHandler {
  constructor(
    private readonly database: DatabaseService,
    @InjectQueue(QueueEnum.UserEvents) private readonly userEventsQueue: Queue,
  ) {}

  @OnEvent(EventsEnum.UserCreated)
  @LogActivity()
  async handleUserCreatedEvent(event: CreateEventUserCreatedDto) {
    const user = await this.findUserById(event.userId)
    await Promise.all([
      this.userEventsQueue.add(UserEventsConsumerEnum.SendWelcomeEmail, user),
      this.userEventsQueue.add(
        UserEventsConsumerEnum.CreateUserEmbedding,
        user,
      ),
      this.userEventsQueue.add(
        UserEventsConsumerEnum.StoreUserCreatedEvent,
        new CreateEventUserCreatedJob({ user, data: event.data }),
      ),
    ])
  }

  @OnEvent(EventsEnum.UserDeleted)
  @LogActivity()
  async handleUserDeletedEvent(event: CreateEventUserDeletedDto) {
    await Promise.all([
      this.userEventsQueue.add(
        UserEventsConsumerEnum.StoreUserDeletedEvent,
        event,
      ),
    ])
  }

  @OnEvent(EventsEnum.UserDataUpdated)
  @LogActivity()
  async handleUserDataUpdatedEvent(event: CreateEventUserDataUpdatedDto) {
    const user = await this.findUserById(event.userId)
    await Promise.all([
      this.userEventsQueue.add(
        UserEventsConsumerEnum.StoreUserDataUpdatedEvent,
        new CreateEventUserDataUpdatedJob({ user, data: event.data }),
      ),
    ])
  }

  private async findUserById(userId: number) {
    const user = await this.database.db.query.users.findFirst({
      where: eq(Users.userId, userId),
    })
    if (!user) {
      console.error(`User not found by id ${userId}`)
      throw new Error('User not found.')
    }
    return user
  }
}
