import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { EmbeddingsQueryService } from '@/modules/embeddings/services/embeddings-query.service'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'

@Injectable()
export class EmbeddingsService {
  constructor(
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly llmQueryService: LlmQueryService,
    private readonly embeddingsQueryService: EmbeddingsQueryService,
  ) {}

  async omni(query: string) {
    const nearestResults = await this.findNearestEmbeddings(query)

    const content = nearestResults[0].content

    if (!content) {
      return this.llmQueryService.query(query)
    }
    return this.llmQueryService.query(
      `Given this context: ${content} please answer this question in a concise way: ${query}`,
    )
  }

  async generateEmbeddings(content: string) {
    try {
      return this.llmEmbeddingsService.generateEmbeddings([content])
    } catch (err) {
      throw new InternalServerErrorException('Error generating embeddings.')
    }
  }

  private async findNearestEmbeddings(query: string) {
    const embedding = await this.llmEmbeddingsService.generateEmbeddingForQuery(
      query,
    )
    return this.embeddingsQueryService.findNearestEmbeddings(embedding, {
      limit: 1,
      minSimilarity: 0.3,
    })
  }
}
