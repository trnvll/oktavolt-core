import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { CreateEventUserCreatedDto } from '@/core/events/dtos/create-event-user-created.dto'
import { EventsEnum } from '@/core/events/types/events.enum'
import { LogActivity } from 'utils'
import { CreateEventUserDeletedDto } from '@/core/events/dtos/create-event-user-deleted.dto'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { DatabaseService } from '@/core/database/database.service'
import { eq } from 'drizzle-orm'
import { Users } from 'database'
import {
  CreateEventDto,
  EventOriginEnum,
  EventTargetEnum,
  EventTypeEnum,
  json,
} from 'shared'
import { NotificationsService } from '@/core/notifications/services/notifications.service'
import { UserEmbeddingsService } from '@/modules/users/services/user-embeddings.service'
import { SqsService } from '@/core/sqs/sqs.service'

@Injectable()
export class UsersEventsHandler {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: Logger,
    private readonly notificationService: NotificationsService,
    private readonly userEmbeddingsService: UserEmbeddingsService,
    private readonly sqsService: SqsService,
  ) {}

  @OnEvent(EventsEnum.UserCreated)
  @LogActivity()
  async handleUserCreatedEvent(event: CreateEventUserCreatedDto) {
    const { userId, data } = event
    const user = await this.findUserById(event.userId)

    await this.notificationService.createOrUpdateSubscriber(user)
    await this.notificationService.sendEmailNotification({
      userId,
      email: user.email,
      subject: 'Welcome to Oktavolt.',
      content: 'This is some content.',
    })
    await this.userEmbeddingsService.generateAndSaveEmbeddings(user)

    const dto: Omit<CreateEventDto, 'toEntity'> = {
      userId,
      data,
      type: EventTypeEnum.UserCreated,
      targets: [EventTargetEnum.TimeSeriesDb],
      origin: EventOriginEnum.Api,
      timestamp: new Date(),
    }
    this.logger.debug(`Sending event to SQS: ${json(dto)}`)

    await this.sqsService.sendMessage(dto)
  }

  @OnEvent(EventsEnum.UserDeleted)
  @LogActivity()
  async handleUserDeletedEvent(event: CreateEventUserDeletedDto) {
    const { userId, data } = event

    const dto: Omit<CreateEventDto, 'toEntity'> = {
      userId: userId,
      data,
      type: EventTypeEnum.UserDeleted,
      targets: [EventTargetEnum.TimeSeriesDb],
      origin: EventOriginEnum.Api,
      timestamp: new Date(),
    }

    this.logger.debug(`Sending event to SQS: ${json(dto)}`)
    await this.sqsService.sendMessage(dto)
  }

  @OnEvent(EventsEnum.UserDataUpdated)
  @LogActivity()
  async handleUserDataUpdatedEvent(event: CreateEventUserDataUpdatedDto) {
    const { userId, data } = event

    const dto: Omit<CreateEventDto, 'toEntity'> = {
      userId,
      data,
      type: EventTypeEnum.UserDataUpdated,
      targets: [EventTargetEnum.TimeSeriesDb],
      origin: EventOriginEnum.Api,
      timestamp: new Date(),
    }
    this.logger.debug(`Sending event to SQS: ${json(dto)}`)

    await this.sqsService.sendMessage(dto)
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
