import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { Embeddings, SelectUser } from 'database'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'

@Injectable()
export class UserEmbeddingsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly llmDataTransformationService: LlmDataTransformationService,
  ) {}

  async generateAndSaveEmbeddings(user: SelectUser) {
    const content = await this.createEmbedding(user)
    try {
      const embeddings = await this.llmEmbeddingsService.generateEmbeddings([
        content,
      ])
      await this.database.db.insert(Embeddings).values({
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
