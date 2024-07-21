import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { CommunicationEmbeddings, SelectCommunications } from 'database'

@Injectable()
export class CommsEmbeddingsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly llmDataTransformationService: LlmDataTransformationService,
  ) {}

  async generateAndSaveEmbeddings(comm: SelectCommunications) {
    const content = await this.createEmbedding(comm)
    try {
      const embeddings = await this.llmEmbeddingsService.generateEmbeddings([
        content,
      ])
      await this.database.db.insert(CommunicationEmbeddings).values({
        commId: comm.commId,
        embedding: embeddings[0],
        content: content,
      })
    } catch (err) {
      console.error('Error generating and saving embeddings', err)
    }
  }

  private createEmbedding(comm: SelectCommunications) {
    const commData = {
      id: comm.commId,
      provider: comm.provider,
      sender: comm.sender,
      receiver: comm.receiver,
      type: comm.type,
      content: comm.content,
      createdAt: comm.createdAt,
      updatedAt: comm.updatedAt,
    }
    return this.llmDataTransformationService.transform('comms', commData)
  }
}
