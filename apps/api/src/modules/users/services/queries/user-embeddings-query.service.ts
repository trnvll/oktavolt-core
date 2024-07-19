import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import { UserEmbeddings } from 'database'
import { UserEmbeddingsQueryServiceFindNearestEmbeddingsOptions } from '@/modules/users/types/user-embeddings-query-service'

@Injectable()
export class UserEmbeddingsQueryService {
  constructor(private readonly database: DatabaseService) {}

  async findNearestEmbeddings(
    embedding: number[],
    options:
      | UserEmbeddingsQueryServiceFindNearestEmbeddingsOptions
      | undefined = {
      minSimilarity: 0.2,
      limit: 5,
    },
  ) {
    const similarity = sql<number>`1 - (${cosineDistance(
      UserEmbeddings.embedding,
      embedding,
    )})`

    return this.database.db
      .select({
        userId: UserEmbeddings.userId,
        content: UserEmbeddings.content,
        similarity,
      })
      .from(UserEmbeddings)
      .where(gt(similarity, options.minSimilarity))
      .orderBy((t) => desc(t.similarity))
      .limit(options.limit)
  }
}
