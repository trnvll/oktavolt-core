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
import { ResourcesQueryService } from '@/modules/resources/services/resources-query.service'
import { ResourcesService } from '@/modules/resources/services/resources.service'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { ChatsLlmApiToolsService } from '@/modules/chats/services/chats-llm-api-tools.service'
import { ChatsService } from '@/modules/chats/services/chats.service'
import { ChatsQueryService } from '@/modules/chats/services/queries/chats-query.service'

@Module({
  imports: [DatabaseModule],
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
    ResourcesService,
    LlmEmbeddingsService,
    ChatsLlmApiToolsService,
    ChatsService,
    ChatsQueryService,
  ],
  exports: [
    ToolExecsService,
    ToolExecsFnsService,
    ToolExecsLlmToolsService,
    ToolExecsHandlingService,
  ],
})
export class ToolExecsModule {}
