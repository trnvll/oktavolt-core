import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'
import { ResourcesQueryService } from '@/modules/resources/services/resources-query.service'
import { ResourcesService } from '@/modules/resources/services/resources.service'
import { BullModule } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { ResourcesEventsConsumer } from '@/modules/resources/consumers/resources-events.consumer'
import { ResourcesLlmPersonalToolsService } from '@/modules/resources/services/resources-llm-personal-tools.service'
import { ResourcesLlmApiToolsService } from '@/modules/resources/services/resources-llm-api-tools.service'
import { ResourcesLlmWorkToolsService } from '@/modules/resources/services/resources-llm-work-tools.service'

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: QueueEnum.ResourcesEvents }),
  ],
  controllers: [],
  providers: [
    DatabaseService,
    LlmEmbeddingsService,
    LlmQueryService,
    ResourcesService,
    ResourcesQueryService,
    ResourcesEventsConsumer,
    ResourcesLlmPersonalToolsService,
    ResourcesLlmApiToolsService,
    ResourcesLlmWorkToolsService,
  ],
  exports: [ResourcesService, ResourcesQueryService],
})
export class ResourcesModule {}