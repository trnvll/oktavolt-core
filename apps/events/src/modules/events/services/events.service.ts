import { Injectable } from '@nestjs/common'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { UserEvents } from 'tsdb'
import { LogActivity } from 'utils'
import { CreateEventDto } from 'shared'
import { FindAllUserEventsMapper } from '@/modules/events/mappers/find-user-events.mapper'

@Injectable()
export class EventsService {
  constructor(private readonly tsdbService: TsdbService) {}

  @LogActivity()
  async createUserEvent(userEventDto: CreateEventDto) {
    const entity = userEventDto.toEntity()
    const result = await this.tsdbService.db
      .insert(UserEvents)
      .values(entity)
      .returning()
    return CreateEventDto.fromEntity(result[0])
  }

  @LogActivity()
  async findAllUserEvents() {
    const plainUserEvents = await this.tsdbService.db
      .select()
      .from(UserEvents)
      .execute()
    return FindAllUserEventsMapper.fromEntity(plainUserEvents)
  }
}
