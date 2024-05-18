import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { PrefsService } from '@/modules/prefs/services/prefs.service'
import { PrefsController } from '@/modules/prefs/controllers/prefs.controller'

@Module({
  imports: [DatabaseModule],
  providers: [DatabaseService, PrefsService],
  exports: [PrefsService],
  controllers: [PrefsController],
})
export class PrefsModule {}
