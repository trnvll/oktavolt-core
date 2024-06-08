import { Module } from '@nestjs/common'
import { TimeSeriesDatabaseService } from '@/modules/time-series-database/services/time-series-database.service'
import { TsdbModule } from '@/core/tsdb/tsdb.module'
import { TsdbService } from '@/core/tsdb/tsdb.service'

@Module({
  imports: [TsdbModule],
  providers: [TimeSeriesDatabaseService, TsdbService],
  exports: [TimeSeriesDatabaseService],
})
export class TimeSeriesDatabaseModule {}
