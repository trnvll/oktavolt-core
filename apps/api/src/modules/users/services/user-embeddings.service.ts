import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { SelectUser, UserEmbeddings } from 'database'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { LogActivity, LogLevelEnum } from 'utils'
import { UserEmbeddingsQueryService } from '@/modules/users/services/queries/user-embeddings-query.service'

@Injectable()
export class UserEmbeddingsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly llmDataTransformationService: LlmDataTransformationService,
    private readonly userEmbeddingsQueryService: UserEmbeddingsQueryService,
  ) {}

  @LogActivity({
    logEntry: false,
    level: LogLevelEnum.DEBUG,
  })
  async findNearestEmbeddings(query: string) {
    const embedding = await this.llmEmbeddingsService.generateEmbeddingForQuery(
      query,
    )
    return this.userEmbeddingsQueryService.findNearestEmbeddings(embedding, {
      limit: 1,
      minSimilarity: 0.3,
    })
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
      userId: user.userId,
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
