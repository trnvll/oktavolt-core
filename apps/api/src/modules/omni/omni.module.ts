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
import { UsersLlmApiToolsService } from '@/modules/users/services/users-llm-api-tools.service'
import { RelationshipsLlmToolsService } from '@/modules/relationships/services/relationships-llm-tools.service'
import { RelationshipsService } from '@/modules/relationships/services/relationships.service'
import { BullModule } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { ChatsFnsService } from '@/modules/chats/services/chats-fns.service'

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: QueueEnum.RelationshipsEvents }),
    BullModule.registerQueue({ name: QueueEnum.ChatsEvents }),
  ],
  controllers: [OmniController],
  providers: [
    DatabaseService,
    OmniService,
    LlmOpenapiActionsService,
    LlmQueryService,
    UsersLlmApiToolsService,
    LlmChatService,
    UsersService,
    UsersQueryService,
    RelationshipsLlmToolsService,
    RelationshipsService,
    ChatsFnsService,
  ],
  exports: [OmniService],
})
export class OmniModule {}
