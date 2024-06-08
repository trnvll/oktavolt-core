import { IEventHandler } from '@/types/event-handler-service'
import { Injectable } from '@nestjs/common'
import { CreateEventDto, TrackingEventDetailsDto } from 'shared'
import Mixpanel from 'mixpanel'
import { CreateEventDtoToMixpanelDtoMapper } from '@/modules/mixpanel/mappers/create-event-dto-to-mixpanel-dto.mapper'
import { envConfig } from '@/config/env/env.config'
import { LogActivity } from 'utils'

@Injectable()
export class MixpanelService implements IEventHandler {
  private mixpanel: Mixpanel.Mixpanel

  constructor() {
    this.mixpanel = Mixpanel.init(envConfig.get('MIXPANEL_TOKEN'))
  }

  @LogActivity({ logEntry: false })
  async handleEvent(
    event: CreateEventDto<TrackingEventDetailsDto>,
  ): Promise<void> {
    const mixpanelDto = CreateEventDtoToMixpanelDtoMapper.map(event)
    return this.mixpanel.track(event.type, mixpanelDto)
  }
}
