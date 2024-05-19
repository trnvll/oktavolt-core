import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { SelectUser, UserEmbeddings } from 'database'

@Injectable()
export class UserEmbeddingsService {
  constructor(
    private database: DatabaseService,
    private llmEmbeddingsService: LlmEmbeddingsService,
  ) {}

  async generateAndSaveEmbeddings(user: SelectUser) {
    const content = this.formatUserData(user)
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

  private formatUserData(user: SelectUser): string {
    const { firstName, lastName, email, dob, phone, createdAt, context } = user
    return `${firstName} ${lastName} | Email: ${email} | Phone: ${phone} | Date of Birth: ${dob} | Context: ${context} | Created At: ${createdAt}`
  }
}
