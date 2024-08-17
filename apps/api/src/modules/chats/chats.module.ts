import { Module } from '@nestjs/common'
import { ChatsService } from '@/modules/chats/services/chats.service'
import { ChatsController } from '@/modules/chats/controllers/chats.controller'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmDataTransformationService } from '@/core/llm/services/llm-data-transformation.service'
import { BullModule } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { ChatsEmbeddingsService } from '@/modules/chats/services/chats-embeddings.service'
import { ChatsEventsConsumer } from '@/modules/chats/consumers/chats-events.consumer'
import { SqsService } from '@/core/sqs/sqs.service'
import { ChatsFnsService } from '@/modules/chats/services/chats-fns.service'
import { ToolExecsModule } from '@/modules/tool-execs/tool-execs.module'
import { ResourcesLlmToolsService } from '@/modules/resources/services/resources-llm-tools.service'
import { ResourcesQueryService } from '@/modules/resources/services/resources-query.service'
import { ResourcesService } from '@/modules/resources/services/resources.service'
import { ResourcesEventsConsumer } from '@/modules/resources/consumers/resources-events.consumer'

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: QueueEnum.ChatsEvents }),
    BullModule.registerQueue({ name: QueueEnum.ResourcesEvents }),
    ToolExecsModule,
  ],
  controllers: [ChatsController],
  providers: [
    DatabaseService,
    ChatsService,
    ChatsEmbeddingsService,
    ChatsEventsConsumer,
    ChatsFnsService,
    LlmChatService,
    LlmEmbeddingsService,
    LlmDataTransformationService,
    SqsService,
    ResourcesLlmToolsService,
    ResourcesQueryService,
    ResourcesService,
    ResourcesEventsConsumer,
  ],
  exports: [ChatsService, ChatsEmbeddingsService, ChatsFnsService],
})
export class ChatsModule {}
