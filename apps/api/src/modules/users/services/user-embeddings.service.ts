import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { SelectUser, UserEmbeddings } from 'database'
import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { LogActivity, LogLevelEnum } from 'utils'

@Injectable()
export class UserEmbeddingsService {
  constructor(
    private database: DatabaseService,
    private llmEmbeddingsService: LlmEmbeddingsService,
    private readonly llmDataTransformationService: LlmDataTransformationService,
  ) {}

  @LogActivity({
    logEntry: false,
    level: LogLevelEnum.DEBUG,
  })
  async findNearestEmbeddings(query: string, limit = 5) {
    const vector = await this.llmEmbeddingsService.generateEmbeddingForQuery(
      query,
    )
    const similarity = sql<number>`1 - (${cosineDistance(
      UserEmbeddings.embedding,
      vector,
    )})`

    return this.database.db
      .select({
        userId: UserEmbeddings.userId,
        content: UserEmbeddings.content,
        similarity,
      })
      .from(UserEmbeddings)
      .where(gt(similarity, 0.2))
      .orderBy((t) => desc(t.similarity))
      .limit(limit)
  }

  async generateAndSaveEmbeddings(user: SelectUser) {
    const content = await this.createEmbedding(user)
    try {
      const embeddings = await this.llmEmbeddingsService.generateEmbeddings([
        content,
      ])
      await this.database.db.insert(UserEmbeddings).values({
        userId: user.userId,
        embedding: embeddings[0],
        content: content,
      })
    } catch (err) {
      console.error('Error generating and saving embeddings', err)
    }
  }

  private createEmbedding(user: SelectUser) {
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phone,
      dateOfBirth: user.dob,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    return this.llmDataTransformationService.transform('users', userData)
  }
}
