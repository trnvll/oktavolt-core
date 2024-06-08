import { BusinessEventDetailsDto, CreateEventDto } from 'shared'
import { InsertUserEvent } from 'tsdb'

export class CreateEventDtoToTimeSeriesDatabaseEntityMapper {
  static map(dto: CreateEventDto<BusinessEventDetailsDto>): InsertUserEvent {
    return {
      userId: dto.userId,
      eventOrigin: dto.origin,
      eventType: dto.type,
      eventDetails: dto.data,
      timestamp: dto.timestamp,
    }
  }
}
