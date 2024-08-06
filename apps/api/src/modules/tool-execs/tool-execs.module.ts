import { DatabaseService } from '@/core/database/database.service'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { ToolExecsService } from '@/modules/tool-execs/services/tool-execs.service'
import { ToolExecsFnsService } from '@/modules/tool-execs/services/tool-execs-fns.service'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [DatabaseService, ToolExecsService, ToolExecsFnsService],
  exports: [ToolExecsService, ToolExecsFnsService],
})
export class ToolExecsModule {}
