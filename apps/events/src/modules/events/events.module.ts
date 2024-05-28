import { Module } from '@nestjs/common'
import { EventsService } from '@/modules/events/services/events.service'
import { TsdbModule } from '@/core/tsdb/tsdb.module'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { EventsController } from '@/modules/events/controllers/events.controller'
import { EventsQuery } from '@/modules/events/queries/events.query'

@Module({
  imports: [TsdbModule],
  controllers: [EventsController],
  providers: [EventsService, TsdbService, EventsQuery],
  exports: [EventsService],
})
export class EventsModule {}
