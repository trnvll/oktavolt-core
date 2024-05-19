import { Module } from '@nestjs/common'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'

@Module({
  imports: [],
  providers: [LlmEmbeddingsService],
  exports: [LlmEmbeddingsService],
})
export class LlmModule {}
