import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LlmQueryService } from '@/core/llm/services/llm-query.service'
import { ResourcesQueryService } from '@/modules/resources/services/resources-query.service'
import { ResourcesService } from '@/modules/resources/services/resources.service'
import { ResourcesLlmPersonalToolsService } from '@/modules/resources/services/resources-llm-personal-tools.service'
import { ResourcesLlmApiToolsService } from '@/modules/resources/services/resources-llm-api-tools.service'
import { ResourcesLlmWorkToolsService } from '@/modules/resources/services/resources-llm-work-tools.service'
import { ResourcesEventsHandler } from '@/modules/resources/handlers/resources-events.handler'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    DatabaseService,
    LlmEmbeddingsService,
    LlmQueryService,
    ResourcesService,
    ResourcesQueryService,
    ResourcesLlmPersonalToolsService,
    ResourcesLlmApiToolsService,
    ResourcesLlmWorkToolsService,
    ResourcesEventsHandler,
  ],
  exports: [
    ResourcesService,
    ResourcesQueryService,
    ResourcesLlmPersonalToolsService,
    ResourcesLlmApiToolsService,
    ResourcesLlmWorkToolsService,
    ResourcesEventsHandler,
  ],
})
export class ResourcesModule {}
