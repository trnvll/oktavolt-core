import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { SelectUser, UserEmbeddings } from 'database'
import { l2Distance } from 'pgvector/drizzle-orm'
import { CreateEventUserCreatedDto } from '@/core/events/dtos/create-event-user-created.dto'
import { EventsEnum } from '@/core/events/types/events.enum'
import { OnEvent } from '@nestjs/event-emitter'

@Injectable()
export class UserEmbeddingsService {
  constructor(
    private database: DatabaseService,
    private llmEmbeddingsService: LlmEmbeddingsService,
  ) {}

  @OnEvent(EventsEnum.EventUserCreated)
  async generateAndSaveEmbeddings({ user }: CreateEventUserCreatedDto) {
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

  async findNearestEmbeddings(query: string, limit = 5) {
    const vector = await this.llmEmbeddingsService.generateEmbeddingForQuery(
      query,
    )
    return this.database.db
      .select({ userId: UserEmbeddings.userId })
      .from(UserEmbeddings)
      .orderBy(l2Distance(UserEmbeddings.embedding, vector))
      .limit(limit)
  }

  private formatUserData(user: SelectUser): string {
    const { firstName, lastName, email, dob, phone, createdAt, context } = user
    return `${firstName} ${lastName} | Email: ${email} | Phone: ${phone} | Date of Birth: ${dob} | Context: ${context} | Created At: ${createdAt}`
  }
}
