import { Injectable } from '@nestjs/common'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { UserEvents } from 'tsdb'
import { LogActivity } from 'utils'
import { CreateEventDto, PaginationDto, SortDto } from 'shared'
import { FindAllUserEventsMapper } from '@/modules/events/mappers/find-user-events.mapper'
import { EventSortFields } from '@/modules/events/dtos/event-sort-fields'
import { EventsQueryService } from '@/modules/events/services/events-query.service'

@Injectable()
export class EventsService {
  constructor(
    private readonly tsdbService: TsdbService,
    private readonly eventsQueryService: EventsQueryService,
  ) {}

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
  async findAllUserEvents(
    paginationDto: PaginationDto,
    sortDto: SortDto<EventSortFields>,
  ) {
    const result = await this.eventsQueryService.findAllEvents(
      paginationDto,
      sortDto,
    )
    return FindAllUserEventsMapper.fromEntity(result)
  }
}
