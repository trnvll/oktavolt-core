import { Module } from '@nestjs/common'
import { EventsService } from '@/modules/events/services/events.service'
import { TsdbModule } from '@/core/tsdb/tsdb.module'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { EventsController } from '@/modules/events/controllers/events.controller'
import { EventsQueryService } from '@/modules/events/services/events-query.service'

@Module({
  imports: [TsdbModule],
  controllers: [EventsController],
  providers: [EventsService, TsdbService, EventsQueryService],
  exports: [EventsService],
})
export class EventsModule {}
