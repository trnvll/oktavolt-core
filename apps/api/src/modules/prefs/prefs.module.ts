import { Module } from '@nestjs/common'
import { DrizzleModule } from '@/core/drizzle/drizzle.module'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { PrefsService } from '@/modules/prefs/services/prefs.service'
import { PrefsController } from '@/modules/prefs/controllers/prefs.controller'

@Module({
  imports: [DrizzleModule],
  providers: [DrizzleService, PrefsService],
  exports: [PrefsService],
  controllers: [PrefsController],
})
export class PrefsModule {}
