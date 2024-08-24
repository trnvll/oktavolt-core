import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { Chats, Conversations, SelectChat, SelectUser, Users } from 'database'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'
import {
  PaginationDto,
  ResultsWithMetadata,
  SearchDto,
  SortDto,
  SortOrderEnum,
} from 'shared'
import { ChatSortFields } from '@/modules/chats/types/chat-sort-fields'
import { and, asc, count, desc, eq, ilike, SQL } from 'drizzle-orm'

@Injectable()
export class ChatsQueryService {
  constructor(private readonly database: DatabaseService) {}

  async createConv(userId: number, type: LlmConversationTypeEnum) {
    const convsResult = await this.database.db
      .insert(Conversations)
      .values({
        userId,
        type: type as any,
      })
      .returning({ convId: Conversations.convId, type: Conversations.type })
    return convsResult[0]
  }

  async findAllChats(
    user: Pick<SelectUser, 'userId'>,
    paginationDto: PaginationDto,
    sortDto: SortDto<ChatSortFields>,
    searchDto: SearchDto,
  ): Promise<ResultsWithMetadata<SelectChat>> {
    const { page, limit, offset } = paginationDto
    const { sortBy, sortOrder } = sortDto
    const { query } = searchDto

    let whereClause: SQL<unknown> | undefined

    if (query) {
      whereClause = ilike(Chats.content, `%${query}%`)
    }

    const qb = this.database.db
      .select({
        chatId: Chats.chatId,
        content: Chats.content,
        createdAt: Chats.createdAt,
        updatedAt: Chats.updatedAt,
        convId: Chats.convId,
        deletedAt: Chats.deletedAt,
        type: Chats.type,
      })
      .from(Chats)
      .innerJoin(
        Conversations,
        and(
          eq(Chats.convId, Conversations.convId),
          eq(Conversations.userId, user.userId),
        ),
      )
      .limit(limit)
      .offset(offset)

    if (whereClause) {
      qb.where(whereClause)
    }

    if (sortBy && sortOrder) {
      qb.orderBy(
        sortOrder === SortOrderEnum.ASC
          ? asc(Chats[sortBy])
          : desc(Chats[sortBy]),
      )
    }

    const countQuery = this.database.db.select({ count: count() }).from(Chats)

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
