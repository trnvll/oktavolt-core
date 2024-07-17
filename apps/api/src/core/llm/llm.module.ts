import { Module } from '@nestjs/common'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'

@Module({
  imports: [],
  providers: [LlmEmbeddingsService, LlmDataTransformationService],
  exports: [LlmEmbeddingsService, LlmDataTransformationService],
})
export class LlmModule {}
