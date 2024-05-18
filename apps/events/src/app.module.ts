import { Module } from '@nestjs/common'
import { EventsModule } from '@/modules/events/events.module'
import { TsdbModule } from '@/core/tsdb/tsdb.module'

@Module({
  imports: [EventsModule, TsdbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
