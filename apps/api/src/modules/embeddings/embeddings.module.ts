import { Module } from '@nestjs/common'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { EmbeddingsService } from '@/modules/embeddings/services/embeddings.service'
import { EmbeddingsController } from '@/modules/embeddings/controllers/embeddings.controller'

@Module({
  providers: [LlmEmbeddingsService, EmbeddingsService],
  controllers: [EmbeddingsController],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}
