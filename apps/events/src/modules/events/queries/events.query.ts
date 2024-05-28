import { Injectable } from '@nestjs/common'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { UserEvents } from 'tsdb'
import { PaginationDto, SortDto, SortOrderEnum } from 'shared'
import { asc, desc } from 'drizzle-orm'
import { EventSortFields } from '@/modules/events/dtos/event-sort-fields'

@Injectable()
export class EventsQuery {
  constructor(private readonly tsdb: TsdbService) {}

  findAllEvents(
    paginationDto: PaginationDto,
    sortDto: SortDto<EventSortFields>,
  ) {
    const { limit, offset } = paginationDto
    const { sortBy, sortOrder } = sortDto

    const query = this.tsdb.db
      .select()
      .from(UserEvents)
      .limit(limit)
      .offset(offset)

    if (sortBy && sortOrder) {
      query.orderBy(
        sortOrder === SortOrderEnum.ASC
          ? asc(UserEvents[sortBy])
          : desc(UserEvents[sortBy]),
      )
    }

    return query.execute()
  }
}
