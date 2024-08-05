import {
  PaginationDto,
  ResultsWithMetadata,
  SearchDto,
  SortDto,
  SortOrderEnum,
} from 'shared'
import { asc, count, desc, ilike, or, sql, SQL } from 'drizzle-orm'
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
    searchDto: SearchDto,
  ): Promise<ResultsWithMetadata<SelectUser>> {
    const { page, limit, offset } = paginationDto
    const { sortBy, sortOrder } = sortDto
    const { query } = searchDto

    let whereClause: SQL<unknown> | undefined

    if (query) {
      whereClause = or(
        ilike(Users.firstName, `%${query}%`),
        ilike(Users.lastName, `%${query}%`),
        ilike(Users.email, `%${query}%`),
        ilike(Users.phone, `%${query}%`),
        ilike(Users.context, `%${query}%`),
        sql`${Users.firstName} || ' ' || ${Users.lastName} ILIKE ${
          '%' + query + '%'
        }`,
      )
    }

    const qb = this.database.db.select().from(Users).limit(limit).offset(offset)

    if (whereClause) {
      qb.where(whereClause)
    }

    if (sortBy && sortOrder) {
      qb.orderBy(
        sortOrder === SortOrderEnum.ASC
          ? asc(Users[sortBy])
          : desc(Users[sortBy]),
      )
    }

    const countQuery = this.database.db.select({ count: count() }).from(Users)

    if (whereClause) {
      countQuery.where(whereClause)
    }

    const [results, totalCount] = await Promise.all([
      qb.execute(),
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
