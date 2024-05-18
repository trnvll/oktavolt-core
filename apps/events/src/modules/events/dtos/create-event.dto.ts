import { IsDate, IsEnum, IsInt, IsObject } from 'class-validator'
import {
  EventOriginEnum,
  EventTargetEnum,
  EventTypeEnum,
} from '@/modules/events/dtos/core/enums'
import { EventDetails } from '@/modules/events/dtos/event-details'
import { InsertUserEvent } from 'tsdb'
import { instanceToPlain } from 'class-transformer'

export class CreateEventDto {
  @IsInt()
  userId: number

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

  toEntity(): InsertUserEvent {
    return {
      userId: this.userId,
      eventOrigin: this.origin,
      eventType: this.type,
      eventDetails: this.data,
      timestamp: this.timestamp,
    }
  }

  static fromEntity(entity: InsertUserEvent) {
    return instanceToPlain(entity)
  }
}
