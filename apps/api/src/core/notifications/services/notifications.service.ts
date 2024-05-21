import { Injectable } from '@nestjs/common'
import { Novu } from '@novu/node'
import { envConfig } from '@/config/env/env.config'
import { NotificationTypeEnum } from '@/core/notifications/types/notification-types.enum'
import { OnEvent } from '@nestjs/event-emitter'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserCreatedDto } from '@/core/events/dtos/create-event-user-created.dto'

@Injectable()
export class NotificationsService {
  private readonly novu: Novu

  constructor() {
    this.novu = new Novu({ apiKey: envConfig.get('NOVU_API_KEY') })
  }

  @OnEvent(EventsEnum.EventUserCreated)
  async createOrUpdateSubscriber({ user }: CreateEventUserCreatedDto) {
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

  async sendEmailNotification(
    userId: number,
    email: string,
    subject: string,
    content: string,
  ) {
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
