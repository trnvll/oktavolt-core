import { Module } from '@nestjs/common'
import { CommsController } from '@/modules/comms/controllers/comms.controller'
import { DatabaseModule } from '@/core/database/database.module'
import { CommsService } from '@/modules/comms/services/comms.service'
import { DatabaseService } from '@/core/database/database.service'

@Module({
  imports: [DatabaseModule],
  providers: [DatabaseService, CommsService],
  exports: [CommsService],
  controllers: [CommsController],
})
export class CommsModule {}
