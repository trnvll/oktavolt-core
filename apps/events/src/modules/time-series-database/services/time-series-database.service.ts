import { Injectable } from '@nestjs/common'
import { IEventHandler } from '@/types/event-handler-service'
import { BusinessEventDetailsDto, CreateEventDto } from 'shared'
import { UserEvents } from 'tsdb'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { CreateEventDtoToTimeSeriesDatabaseEntityMapper } from '@/modules/time-series-database/mappers/create-event-dto-to-time-series-database-entity.mapper'
import { LogActivity } from 'utils'

@Injectable()
export class TimeSeriesDatabaseService implements IEventHandler {
  constructor(private readonly tsdbService: TsdbService) {}

  @LogActivity({ logEntry: false })
  async handleEvent(userEventDto: CreateEventDto<BusinessEventDetailsDto>) {
    const entity =
      CreateEventDtoToTimeSeriesDatabaseEntityMapper.map(userEventDto)
    await this.tsdbService.db.insert(UserEvents).values(entity).returning()
  }
}
