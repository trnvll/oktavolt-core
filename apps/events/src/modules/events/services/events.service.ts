import { Injectable } from '@nestjs/common'
import { LogActivity } from 'utils'
import { CreateEventDto, PaginationDto, SortDto } from 'shared'
import { FindAllUserEventsMapper } from '@/modules/events/mappers/find-user-events.mapper'
import { EventSortFields } from '@/modules/events/dtos/event-sort-fields'
import { EventsQueryService } from '@/modules/events/services/events-query.service'
import { EventHandlerRegistry } from '@/modules/events/services/event-handler-registry'

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsQueryService: EventsQueryService,
    private readonly eventHandlerRegistry: EventHandlerRegistry,
  ) {}

  @LogActivity()
  async createUserEvent(userEventDto: CreateEventDto) {
    for (const target of userEventDto.targets) {
      const handler = this.eventHandlerRegistry.getHandler(target)
      if (handler) {
        await handler.handleEvent(userEventDto)
      }
    }
  }

  @LogActivity()
  async findAllUserEvents(
    paginationDto: PaginationDto,
    sortDto: SortDto<EventSortFields>,
  ) {
    const result = await this.eventsQueryService.findAllEvents(
      paginationDto,
      sortDto,
    )
    return FindAllUserEventsMapper.fromEntity(result)
  }
}
