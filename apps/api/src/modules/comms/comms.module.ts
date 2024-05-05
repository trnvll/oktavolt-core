import { Module } from '@nestjs/common'
import { CommsController } from '@/modules/comms/controllers/comms.controller'
import { DrizzleModule } from '@/core/drizzle/drizzle.module'
import { CommsService } from '@/modules/comms/services/comms.service'
import { DrizzleService } from '@/core/drizzle/drizzle.service'

@Module({
  imports: [DrizzleModule],
  providers: [DrizzleService, CommsService],
  exports: [CommsService],
  controllers: [CommsController],
})
export class CommsModule {}
