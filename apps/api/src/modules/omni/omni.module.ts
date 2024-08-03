import { Module } from '@nestjs/common'
import { OmniService } from '@/modules/omni/services/omni.service'
import { LlmOpenapiActionsService } from '@/core/llm/services/llm-openapi-actions.service'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'
import { OmniController } from '@/modules/omni/controllers/omni.controller'

@Module({
  imports: [],
  controllers: [OmniController],
  providers: [OmniService, LlmOpenapiActionsService, LlmQueryService],
  exports: [OmniService],
})
export class OmniModule {}
