import { Module } from '@nestjs/common'
import { NotificationsService } from '@/core/notifications/services/notifications.service'

@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
