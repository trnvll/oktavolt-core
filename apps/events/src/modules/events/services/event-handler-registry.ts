import { EventTargetEnum } from 'shared'
import { Injectable } from '@nestjs/common'
import { IEventHandler } from '@/types/event-handler-service'
import { MixpanelService } from '@/modules/mixpanel/services/mixpanel.service'
import { TimeSeriesDatabaseService } from '@/modules/time-series-database/services/time-series-database.service'

@Injectable()
export class EventHandlerRegistry {
  private readonly handlers: Record<EventTargetEnum, IEventHandler | undefined>

  constructor(
    private readonly mixpanelService: MixpanelService,
    private readonly timeSeriesDatabaseService: TimeSeriesDatabaseService,
  ) {
    this.handlers = {
      [EventTargetEnum.Mixpanel]: this.mixpanelService,
      [EventTargetEnum.TimeSeriesDb]: this.timeSeriesDatabaseService,
      [EventTargetEnum.Crm]: undefined,
      [EventTargetEnum.EmailService]: undefined,
      [EventTargetEnum.AnalyticsService]: undefined,
      [EventTargetEnum.FileStorage]: undefined,
      [EventTargetEnum.LogService]: undefined,
      [EventTargetEnum.MessageQueue]: undefined,
      [EventTargetEnum.NotificationService]: undefined,
    }
  }

  getHandler(target: EventTargetEnum): IEventHandler | undefined {
    return this.handlers[target]
  }
}
