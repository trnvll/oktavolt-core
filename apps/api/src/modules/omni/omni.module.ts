import { Module } from '@nestjs/common'
import { OmniService } from '@/modules/omni/services/omni.service'
import { LlmOpenapiActionsService } from '@/core/llm/services/llm-openapi-actions.service'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'
import { OmniController } from '@/modules/omni/controllers/omni.controller'
import { LlmToolsService } from '@/core/llm/services/llm-tools.service'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import { UsersService } from '@/modules/users/services/users.service'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'

@Module({
  imports: [DatabaseModule],
  controllers: [OmniController],
  providers: [
    OmniService,
    LlmOpenapiActionsService,
    LlmQueryService,
    LlmToolsService,
    LlmChatService,
    UsersService,
    UsersQueryService,
    DatabaseService,
  ],
  exports: [OmniService],
})
export class OmniModule {}
