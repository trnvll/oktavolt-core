import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'

@Injectable()
export class EmbeddingsService {
  constructor(private readonly llmEmbeddingsService: LlmEmbeddingsService) {}

  async generateEmbeddings(content: string) {
    try {
      return this.llmEmbeddingsService.generateEmbeddings([content])
    } catch (err) {
      throw new InternalServerErrorException('Error generating embeddings.')
    }
  }
}
