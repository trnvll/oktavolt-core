import { Injectable, Logger } from '@nestjs/common'
import {
  CreateEventDto,
  EventOriginEnum,
  EventTargetEnum,
  EventTypeEnum,
} from 'shared'
import { OnEvent } from '@nestjs/event-emitter'
import { SqsService } from '@/core/sqs/sqs.service'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDeletedDto } from '@/core/events/dtos/create-event-user-deleted.dto'

@Injectable()
export class EventsService {
  constructor(
    private readonly sqsService: SqsService,
    private readonly logger: Logger,
  ) {}

  @OnEvent(EventsEnum.UserDeleted)
  async handleUserDeletedEvent(eventDto: CreateEventUserDeletedDto) {
    const dto: Omit<CreateEventDto, 'toEntity'> = {
      ...eventDto,
      type: EventTypeEnum.UserDeleted,
      targets: [EventTargetEnum.TimeSeriesDb],
      origin: EventOriginEnum.Api,
      timestamp: new Date(),
    }
    this.logger.debug(`Sending event to SQS: ${JSON.stringify(dto, null, 2)}`)

    return await this.sqsService.sendMessage(dto)
  }

  @OnEvent(EventsEnum.UserDataUpdated)
  async handleUserDataUpdatedEvent(eventDto: CreateEventUserDataUpdatedDto) {
    const dto: Omit<CreateEventDto, 'toEntity'> = {
      ...eventDto,
      type: EventTypeEnum.UserDataUpdated,
      targets: [EventTargetEnum.TimeSeriesDb],
      origin: EventOriginEnum.Api,
      timestamp: new Date(),
    }
    this.logger.debug(`Sending event to SQS: ${JSON.stringify(dto, null, 2)}`)

    return await this.sqsService.sendMessage(dto)
  }
}
