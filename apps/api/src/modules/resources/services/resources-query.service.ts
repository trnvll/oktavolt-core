import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { and, cosineDistance, desc, eq, gt, sql } from 'drizzle-orm'
import { Resources } from 'database'
import { LogActivity, LogLevelEnum } from 'utils'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'

@Injectable()
export class ResourcesQueryService {
  constructor(private readonly database: DatabaseService) {}

  @LogActivity({ level: LogLevelEnum.DEBUG, logEntry: false })
  async findSimilarResources(
    embedding: number[],
    userId: number,
    convType: LlmConversationTypeEnum,
    options?: {
      limit?: number
      minSimilarity?: number
    },
  ) {
    const similarity = sql<number>`1 - (${cosineDistance(
      Resources.embedding,
      embedding,
    )})`

    return this.database.db
      .select({
        userId: Resources.userId,
        content: Resources.content,
        similarity,
      })
      .from(Resources)
      .where(
        and(
          eq(Resources.userId, userId),
          eq(Resources.type, convType as any),
          gt(similarity, options?.minSimilarity ?? 0.2),
        ),
      )
      .orderBy((t) => desc(t.similarity))
      .limit(options?.limit ?? 3)
  }
}
