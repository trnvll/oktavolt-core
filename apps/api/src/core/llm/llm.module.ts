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
    DatabaseService,
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
