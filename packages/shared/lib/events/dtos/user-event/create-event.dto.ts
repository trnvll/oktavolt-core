import { IsDate, IsEnum, IsInt, IsObject } from 'class-validator'
import { InsertUserEvent } from 'tsdb'
import { instanceToPlain, Transform } from 'class-transformer'
import {
  EventDetails,
  EventOriginEnum,
  EventTargetEnum,
  EventTypeEnum,
} from '@/events'

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
  @Transform(({ value }) => new Date(value))
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
