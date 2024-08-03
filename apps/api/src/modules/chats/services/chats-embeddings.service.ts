import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { Embeddings, SelectChat } from 'database'

@Injectable()
export class ChatsEmbeddingsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly llmDataTransformationService: LlmDataTransformationService,
  ) {}

  async generateAndSaveEmbeddings(chat: SelectChat) {
    const content = await this.createEmbedding(chat)
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
    const chatData = {
      id: chat.chatId,
      chatType: chat.type,
      content: chat.content,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }
    return this.llmDataTransformationService.transform('chats', chatData)
  }
}
