import { CreateEventDto, TrackingEventDetailsDto } from 'shared'
import { PropertyDict } from 'mixpanel'

type MixpanelDto = PropertyDict

export class CreateEventDtoToMixpanelDtoMapper {
  static map(
    createEventDto: CreateEventDto<TrackingEventDetailsDto>,
  ): MixpanelDto {
    return {
      ...createEventDto.data,
      distinct_id: createEventDto.userId,
      ip: createEventDto.data.metadata?.ipAddress,
      timestamp: createEventDto.timestamp,
    }
  }
}
