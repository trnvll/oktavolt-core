import { Module } from '@nestjs/common'
import { EventsService } from '@/modules/events/services/events.service'

@Module({
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
