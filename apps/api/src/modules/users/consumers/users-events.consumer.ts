import { Injectable } from '@nestjs/common'
import { LogActivity } from 'utils'
import { Job } from 'bull'
import { Process, Processor } from '@nestjs/bull'
import { NotificationsService } from '@/core/notifications/services/notifications.service'
import { CreateEventUserCreatedDto } from '@/core/events/dtos/create-event-user-created.dto'
import { SelectUser } from 'database'
import { UserEmbeddingsService } from '@/modules/users/services/user-embeddings.service'
import { QueueEnum } from '@/types/queues/queue.enum'
import {
  CreateEventDto,
  EventOriginEnum,
  EventTargetEnum,
  EventTypeEnum,
} from 'shared'
import { Logger } from '@nestjs/common'
import { SqsService } from '@/core/sqs/sqs.service'
import { CreateEventUserDeletedDto } from '@/core/events/dtos/create-event-user-deleted.dto'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'

export enum UserEventsConsumerEnum {
  SendWelcomeEmail = 'send-welcome-email',
  StoreUserCreatedEvent = 'store-user-created-event',
  StoreUserDeletedEvent = 'store-user-deleted-event',
  StoreUserUpdatedEvent = 'store-user-updated-event',
  CreateUserEmbedding = 'create-user-embedding',
}

@Injectable()
@Processor(QueueEnum.UserEvents)
export class UsersEventsConsumer {
  constructor(
    private readonly logger: Logger,
    private readonly notificationService: NotificationsService,
    private readonly userEmbeddingsService: UserEmbeddingsService,
    private readonly sqsService: SqsService,
  ) {}

  @Process(UserEventsConsumerEnum.SendWelcomeEmail)
  @LogActivity()
  async handleSendWelcomeEmail(job: Job<SelectUser>) {
    await this.notificationService.createOrUpdateSubscriber(job.data)
    await this.notificationService.sendEmailNotification(
      job.data.userId,
      job.data.email,
      'Welcome to Oktavolt.',
      'This is some content.',
    )
  }

  @Process(UserEventsConsumerEnum.StoreUserCreatedEvent)
  @LogActivity()
  async handleStoreUserEvent(job: Job<CreateEventUserCreatedDto>) {
    const { user, data } = job.data
    const dto: Omit<CreateEventDto, 'toEntity'> = {
      userId: user.userId,
      data,
      type: EventTypeEnum.UserCreated,
      targets: [EventTargetEnum.TimeSeriesDb],
      origin: EventOriginEnum.Api,
      timestamp: new Date(),
    }
    this.logger.debug(`Sending event to SQS: ${JSON.stringify(dto, null, 2)}`)

    await this.sqsService.sendMessage(dto)
  }

  @Process(UserEventsConsumerEnum.StoreUserDeletedEvent)
  @LogActivity()
  async handleUserDeletedEvent(eventDto: CreateEventUserDeletedDto) {
    const dto: Omit<CreateEventDto, 'toEntity'> = {
      ...eventDto,
      type: EventTypeEnum.UserDeleted,
      targets: [EventTargetEnum.TimeSeriesDb],
      origin: EventOriginEnum.Api,
      timestamp: new Date(),
    }
    this.logger.debug(`Sending event to SQS: ${JSON.stringify(dto, null, 2)}`)

    await this.sqsService.sendMessage(dto)
  }

  @Process(UserEventsConsumerEnum.StoreUserUpdatedEvent)
  @LogActivity()
  async handleUserDataUpdatedEvent(eventDto: CreateEventUserDataUpdatedDto) {
    const dto: Omit<CreateEventDto, 'toEntity'> = {
      ...eventDto,
      type: EventTypeEnum.UserDataUpdated,
      targets: [EventTargetEnum.TimeSeriesDb],
      origin: EventOriginEnum.Api,
      timestamp: new Date(),
    }
    this.logger.debug(`Sending event to SQS: ${JSON.stringify(dto, null, 2)}`)

    await this.sqsService.sendMessage(dto)
  }

  @Process(UserEventsConsumerEnum.CreateUserEmbedding)
  @LogActivity()
  async handleCreateUserEmbedding(job: Job<SelectUser>) {
    await this.userEmbeddingsService.generateAndSaveEmbeddings(job.data)
  }
}
