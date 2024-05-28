import { Module } from '@nestjs/common'
import { EventsService } from '@/modules/events/services/events.service'
import { TsdbModule } from '@/core/tsdb/tsdb.module'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { EventsController } from '@/modules/events/controllers/events.controller'

@Module({
  imports: [TsdbModule],
  controllers: [EventsController],
  providers: [EventsService, TsdbService],
  exports: [EventsService],
})
export class EventsModule {}
