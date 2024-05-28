import { Injectable } from '@nestjs/common'
import { TsdbService } from '@/core/tsdb/tsdb.service'
import { SelectUserEvent, UserEvents } from 'tsdb'
import {
  PaginationDto,
  ResultsWithMetadata,
  SortDto,
  SortOrderEnum,
} from 'shared'
import { asc, desc, count } from 'drizzle-orm'
import { EventSortFields } from '@/modules/events/dtos/event-sort-fields'

@Injectable()
export class EventsQueryService {
  constructor(private readonly tsdb: TsdbService) {}

  async findAllEvents(
    paginationDto: PaginationDto,
    sortDto: SortDto<EventSortFields>,
  ): Promise<ResultsWithMetadata<SelectUserEvent>> {
    const { page, limit, offset } = paginationDto
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

    const countQuery = this.tsdb.db.select({ count: count() }).from(UserEvents)

    const [results, totalCount] = await Promise.all([
      query.execute(),
      countQuery.execute(),
    ])

    return {
      results,
      metadata: {
        page,
        pageSize: limit,
        totalPages: Math.ceil(totalCount[0].count / limit),
        totalResults: totalCount[0].count,
      },
    }
  }
}
