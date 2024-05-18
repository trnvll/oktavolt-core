import { IsDate, IsEnum, IsObject } from 'class-validator'
import {
  EventOriginEnum,
  EventTargetEnum,
  EventTypeEnum,
} from '@/modules/events/dtos/core/enums'
import { EventDetails } from '@/modules/events/dtos/event-details'

export class CreateEventDto {
  @IsEnum(EventTypeEnum)
  type: EventTypeEnum

  @IsEnum(EventTargetEnum, { each: true })
  targets: EventTargetEnum[]

  @IsObject()
  data: EventDetails

  @IsDate()
  timestamp: Date

  @IsEnum(EventOriginEnum)
  origin: EventOriginEnum
}
