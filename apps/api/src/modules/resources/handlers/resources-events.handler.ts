import { Injectable } from '@nestjs/common'
import { ResourcesService } from '@/modules/resources/services/resources.service'
import { LogActivity } from 'utils'
import { EventsEnum } from '@/core/events/types/events.enum'
import { OnEvent } from '@nestjs/event-emitter'
import { CreateEventResourceCreatedDto } from '@/modules/resources/dtos/events/create-event-resource-created.dto'

@Injectable()
export class ResourcesEventsHandler {
  constructor(private readonly resourcesService: ResourcesService) {}

  @OnEvent(EventsEnum.ResourceCreated, { async: true })
  @LogActivity()
  async handleCreateResourceEvent(event: CreateEventResourceCreatedDto) {
    return await this.resourcesService.create(event.userId, event.data)
  }
}
