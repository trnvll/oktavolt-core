import { Module } from '@nestjs/common'
import { ChatsLlmService } from '@/modules/chats/services/chats-llm.service'
import { ChatsController } from '@/modules/chats/controllers/chats.controller'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { ChatsEmbeddingsService } from '@/modules/chats/services/chats-embeddings.service'
import { SqsService } from '@/core/sqs/sqs.service'
import { ChatsFnsService } from '@/modules/chats/services/chats-fns.service'
import { ToolExecsModule } from '@/modules/tool-execs/tool-execs.module'
import { ChatsQueryService } from '@/modules/chats/services/queries/chats-query.service'
import { ResourcesQueryService } from '@/modules/resources/services/resources-query.service'
import { ChatsService } from '@/modules/chats/services/chats.service'
import { ChatsLlmApiToolsService } from '@/modules/chats/services/chats-llm-api-tools.service'
import { ChatsEventsHandler } from '@/modules/chats/handlers/chats-events.handler'
import { ResourcesService } from '@/modules/resources/services/resources.service'

@Module({
  imports: [DatabaseModule, ToolExecsModule],
  controllers: [ChatsController],
  providers: [
    DatabaseService,
    ChatsLlmService,
    ChatsEmbeddingsService,
    ChatsFnsService,
    ChatsQueryService,
    ChatsService,
    ChatsLlmApiToolsService,
    ChatsEventsHandler,
    LlmChatService,
    LlmEmbeddingsService,
    LlmDataTransformationService,
    SqsService,
    ResourcesQueryService,
    ResourcesService,
  ],
  exports: [
    ChatsLlmService,
    ChatsEmbeddingsService,
    ChatsFnsService,
    ChatsQueryService,
    ChatsService,
    ChatsLlmApiToolsService,
    ChatsEventsHandler,
  ],
})
export class ChatsModule {}
