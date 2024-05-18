import { Logger, Module } from '@nestjs/common'
import { SqsModule } from '@/core/sqs/sqs.module'
import { EventsService } from '@/core/events/services/events.service'

@Module({
  imports: [SqsModule],
  providers: [EventsService, Logger],
  exports: [EventsService],
})
export class EventsModule {}
