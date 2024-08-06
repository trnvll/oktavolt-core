import { Module } from '@nestjs/common'
import { OmniService } from '@/modules/omni/services/omni.service'
import { LlmOpenapiActionsService } from '@/core/llm/services/llm-openapi-actions.service'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'
import { OmniController } from '@/modules/omni/controllers/omni.controller'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import { UsersService } from '@/modules/users/services/users.service'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'
import { UsersLlmToolsService } from '@/modules/users/services/users-llm-tools.service'
import { RelationshipsLlmToolsService } from '@/modules/relationships/services/relationships-llm-tools.service'
import { RelationshipsService } from '@/modules/relationships/services/relationships.service'
import { BullModule } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: QueueEnum.RelationshipsEvents }),
  ],
  controllers: [OmniController],
  providers: [
    DatabaseService,
    OmniService,
    LlmOpenapiActionsService,
    LlmQueryService,
    UsersLlmToolsService,
    LlmChatService,
    UsersService,
    UsersQueryService,
    RelationshipsLlmToolsService,
    RelationshipsService,
  ],
  exports: [OmniService],
})
export class OmniModule {}
