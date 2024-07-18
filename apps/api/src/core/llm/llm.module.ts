import { Module } from '@nestjs/common'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'

@Module({
  imports: [],
  providers: [
    LlmEmbeddingsService,
    LlmDataTransformationService,
    LlmQueryService,
  ],
  exports: [
    LlmEmbeddingsService,
    LlmDataTransformationService,
    LlmQueryService,
  ],
})
export class LlmModule {}
