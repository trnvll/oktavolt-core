import { Module } from '@nestjs/common'
import { EventsService } from '@/modules/events/services/events.service'
import { TsdbModule } from '@/core/tsdb/tsdb.module'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { EventsController } from '@/modules/events/controllers/events.controller'
import { EventsQueryService } from '@/modules/events/services/events-query.service'
import { EventHandlerRegistry } from '@/modules/events/services/event-handler-registry'
import { MixpanelService } from '@/modules/mixpanel/services/mixpanel.service'
import { TimeSeriesDatabaseService } from '@/modules/time-series-database/services/time-series-database.service'

@Module({
  imports: [TsdbModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    TsdbService,
    EventsQueryService,
    EventHandlerRegistry,
    TimeSeriesDatabaseService,
    MixpanelService,
  ],
  exports: [EventsService],
})
export class EventsModule {}
