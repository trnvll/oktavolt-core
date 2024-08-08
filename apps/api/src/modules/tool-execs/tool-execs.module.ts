import { DatabaseService } from '@/core/database/database.service'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { ToolExecsService } from '@/modules/tool-execs/services/tool-execs.service'
import { ToolExecsFnsService } from '@/modules/tool-execs/services/tool-execs-fns.service'
import { ToolExecsLlmToolsService } from '@/modules/tool-execs/services/tool-execs-llm-tools.service'
import { UsersService } from '@/modules/users/services/users.service'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'
import { UsersLlmToolsService } from '@/modules/users/services/users-llm-tools.service'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    DatabaseService,
    ToolExecsService,
    ToolExecsFnsService,
    ToolExecsLlmToolsService,
    UsersService,
    UsersQueryService,
    UsersLlmToolsService,
  ],
  exports: [ToolExecsService, ToolExecsFnsService, ToolExecsLlmToolsService],
})
export class ToolExecsModule {}
