import { DatabaseService } from '@/core/database/database.service'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { ToolExecsService } from '@/modules/tool-execs/services/tool-execs.service'
import { ToolExecsFnsService } from '@/modules/tool-execs/services/tool-execs-fns.service'
import { ToolExecsLlmToolsService } from '@/modules/tool-execs/services/tool-execs-llm-tools.service'
import { UsersService } from '@/modules/users/services/users.service'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'
import { UsersLlmApiToolsService } from '@/modules/users/services/users-llm-api-tools.service'
import { ToolExecsHandlingService } from '@/modules/tool-execs/services/tool-execs-handling.service'
import { ResourcesLlmApiToolsService } from '@/modules/resources/services/resources-llm-api-tools.service'
import { ResourcesLlmPersonalToolsService } from '@/modules/resources/services/resources-llm-personal-tools.service'
import { ResourcesLlmWorkToolsService } from '@/modules/resources/services/resources-llm-work-tools.service'
import { QueueEnum } from '@/types/queues/queue.enum'
import { BullModule } from '@nestjs/bull'
import { ResourcesQueryService } from '@/modules/resources/services/resources-query.service'
import { ResourcesEventsConsumer } from '@/modules/resources/consumers/resources-events.consumer'
import { ResourcesService } from '@/modules/resources/services/resources.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: QueueEnum.ResourcesEvents }),
  ],
  controllers: [],
  providers: [
    DatabaseService,
    ToolExecsService,
    ToolExecsFnsService,
    ToolExecsLlmToolsService,
    ToolExecsHandlingService,
    UsersService,
    UsersQueryService,
    UsersLlmApiToolsService,
    ResourcesLlmApiToolsService,
    ResourcesLlmPersonalToolsService,
    ResourcesLlmWorkToolsService,
    ResourcesQueryService,
    ResourcesEventsConsumer,
    ResourcesService,
    LlmEmbeddingsService,
  ],
  exports: [
    ToolExecsService,
    ToolExecsFnsService,
    ToolExecsLlmToolsService,
    ToolExecsHandlingService,
  ],
})
export class ToolExecsModule {}
