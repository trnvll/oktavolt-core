import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { Embeddings, SelectChat } from 'database'

@Injectable()
export class ChatsEmbeddingsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
  ) {}

  async generateAndSaveEmbeddings(chat: SelectChat) {
    const content = this.createEmbedding(chat)
    try {
      const embeddings = await this.llmEmbeddingsService.generateEmbeddings([
        content,
      ])
      await this.database.db.insert(Embeddings).values({
        chatId: chat.chatId,
        embedding: embeddings[0],
        content: content,
      })
    } catch (err) {
      console.error('Error generating and saving embeddings', err)
    }
  }

  private createEmbedding(chat: SelectChat) {
    return chat.content
  }
}
