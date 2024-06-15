import { IEventHandler } from '@/types/event-handler-service'
import { Injectable } from '@nestjs/common'
import { CreateEventDto, TrackingEventDetailsDto } from 'shared'
import Mixpanel from 'mixpanel'
import { CreateEventDtoToMixpanelDtoMapper } from '@/modules/mixpanel/mappers/create-event-dto-to-mixpanel-dto.mapper'
import { LogActivity } from 'utils'
import { ConfigService } from '@nestjs/config'
import { ExternalConfig } from '@/config/external.config'

@Injectable()
export class MixpanelService implements IEventHandler {
  private mixpanel: Mixpanel.Mixpanel

  constructor(private readonly configService: ConfigService) {
    const externalConfig = this.configService.get<ExternalConfig>('external')

    if (!externalConfig?.mixpanelToken) {
      throw new Error('Mixpanel token is missing.')
    }

    this.mixpanel = Mixpanel.init(externalConfig.mixpanelToken)
  }

  @LogActivity({ logEntry: false })
  async handleEvent(
    event: CreateEventDto<TrackingEventDetailsDto>,
  ): Promise<void> {
    const mixpanelDto = CreateEventDtoToMixpanelDtoMapper.map(event)
    return this.mixpanel.track(event.type, mixpanelDto)
  }
}
