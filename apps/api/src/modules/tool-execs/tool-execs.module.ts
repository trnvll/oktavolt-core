import { DatabaseService } from '@/core/database/database.service'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { ToolExecsService } from '@/modules/tool-execs/services/tool-execs.service'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [DatabaseService, ToolExecsService],
  exports: [ToolExecsService],
})
export class ToolExecsModule {}
