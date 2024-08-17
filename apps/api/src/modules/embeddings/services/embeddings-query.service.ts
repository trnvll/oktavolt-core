import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { UserEmbeddingsQueryServiceFindNearestEmbeddingsOptions } from '@/modules/users/types/user-embeddings-query-service'
import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import { Embeddings } from 'database'

@Injectable()
export class EmbeddingsQueryService {
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
      Embeddings.embedding,
      embedding,
    )})`

    return this.database.db
      .select({
        userId: Embeddings.userId,
        content: Embeddings.content,
        similarity,
      })
      .from(Embeddings)
      .where(gt(similarity, options.minSimilarity))
      .orderBy((t) => desc(t.similarity))
      .limit(options.limit)
  }
}
