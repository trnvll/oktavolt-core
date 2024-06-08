import { Module } from '@nestjs/common'
import { MixpanelService } from '@/modules/mixpanel/services/mixpanel.service'

@Module({
  providers: [MixpanelService],
  exports: [MixpanelService],
})
export class MixpanelModule {}
