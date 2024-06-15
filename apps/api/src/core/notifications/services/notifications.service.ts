import { Injectable } from '@nestjs/common'
import { Novu } from '@novu/node'
import { NotificationTypeEnum } from '@/core/notifications/types/notification-types.enum'
import { SelectUser } from 'database'
import { ConfigService } from '@nestjs/config'
import { ExternalConfig } from '@/config/external.config'

@Injectable()
export class NotificationsService {
  private readonly novu: Novu

  constructor(private readonly configService: ConfigService) {
    const externalConfig = configService.get<ExternalConfig>('external')

    if (!externalConfig?.novuApiKey) {
      throw new Error('Novu API Key is missing.')
    }

    this.novu = new Novu({ apiKey: externalConfig.novuApiKey })
  }

  async createOrUpdateSubscriber(user: SelectUser) {
    await this.novu.subscribers.identify(this.getSubscriberId(user.userId), {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    })
  }

  async sendInAppNotification(subscriberId: string, description: string) {
    await this.novu.trigger(NotificationTypeEnum.IN_APP, {
      to: { subscriberId },
      payload: { description },
    })
  }

  async sendEmailNotification({
    userId,
    email,
    subject,
    content,
  }: {
    userId: number
    email: string
    subject: string
    content: string
  }) {
    const subscriberId = this.getSubscriberId(userId)
    await this.novu.trigger(NotificationTypeEnum.EMAIL, {
      to: { subscriberId, email },
      payload: { subject, content },
    })
  }

  async sendSmsNotification(userId: number, message: string) {
    const subscriberId = this.getSubscriberId(userId)

    await this.novu.trigger(NotificationTypeEnum.SMS, {
      to: { subscriberId },
      payload: { message },
    })
  }

  private readonly getSubscriberId = (userId: number) => String(userId)
}
