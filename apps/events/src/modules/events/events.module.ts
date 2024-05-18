import { Module } from '@nestjs/common'
import { EventsService } from '@/modules/events/services/events.service'
import { TsdbModule } from '@/core/tsdb/tsdb.module'
import { TsdbService } from '@/core/tsdb/tsdb.service'

@Module({
  imports: [TsdbModule],
  providers: [EventsService, TsdbService],
  exports: [EventsService],
})
export class EventsModule {}
