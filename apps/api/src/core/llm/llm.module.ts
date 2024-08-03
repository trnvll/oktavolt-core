import { Module } from '@nestjs/common'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'
import { LlmOpenapiActionsService } from '@/core/llm/services/llm-openapi-actions.service'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'

@Module({
  imports: [],
  providers: [
    LlmEmbeddingsService,
    LlmDataTransformationService,
    LlmQueryService,
    LlmOpenapiActionsService,
    LlmChatService,
  ],
  exports: [
    LlmEmbeddingsService,
    LlmDataTransformationService,
    LlmQueryService,
    LlmOpenapiActionsService,
    LlmChatService,
  ],
})
export class LlmModule {}
