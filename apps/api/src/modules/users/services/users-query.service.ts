import {
  PaginationDto,
  ResultsWithMetadata,
  SortDto,
  SortOrderEnum,
} from 'shared'
import { asc, count, desc } from 'drizzle-orm'
import { DatabaseService } from '@/core/database/database.service'
import { Injectable } from '@nestjs/common'
import { SelectUser, Users } from 'database'
import { UserSortFields } from '@/modules/users/types/user-sort-fields'

@Injectable()
export class UsersQueryService {
  constructor(private readonly database: DatabaseService) {}

  async findAllUsers(
    paginationDto: PaginationDto,
    sortDto: SortDto<UserSortFields>,
  ): Promise<ResultsWithMetadata<SelectUser>> {
    const { page, limit, offset } = paginationDto
    const { sortBy, sortOrder } = sortDto

    const query = this.database.db
      .select()
      .from(Users)
      .limit(limit)
      .offset(offset)

    if (sortBy && sortOrder) {
      query.orderBy(
        sortOrder === SortOrderEnum.ASC
          ? asc(Users[sortBy])
          : desc(Users[sortBy]),
      )
    }

    const countQuery = this.database.db.select({ count: count() }).from(Users)

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
