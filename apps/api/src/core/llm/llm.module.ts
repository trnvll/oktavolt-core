import { Module } from '@nestjs/common'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'
import { LlmOpenapiActionsService } from '@/core/llm/services/llm-openapi-actions.service'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import { UsersService } from '@/modules/users/services/users.service'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'
import { ResourcesQueryService } from '@/modules/resources/services/resources-query.service'
import { LlmRagService } from '@/core/llm/services/llm-rag.service'

@Module({
  imports: [DatabaseModule],
  providers: [
    LlmEmbeddingsService,
    LlmDataTransformationService,
    LlmQueryService,
    LlmOpenapiActionsService,
    LlmChatService,
    UsersService,
    UsersQueryService,
    ResourcesQueryService,
    DatabaseService,
    LlmRagService,
  ],
  exports: [
    LlmEmbeddingsService,
    LlmDataTransformationService,
    LlmQueryService,
    LlmOpenapiActionsService,
    LlmChatService,
    LlmRagService,
  ],
})
export class LlmModule {}
