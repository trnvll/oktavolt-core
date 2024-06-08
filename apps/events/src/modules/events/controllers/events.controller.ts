import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { EventsService } from '@/modules/events/services/events.service'
import { CreateEventDto, PaginationDto, SortDto } from 'shared'
import { EventSortFields } from '@/modules/events/dtos/event-sort-fields'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  createUserEvent(@Body() userEventDto: CreateEventDto) {
    return this.eventsService.createUserEvent(userEventDto)
  }

  @Get()
  findAllUserEvents(
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto<EventSortFields>,
  ) {
    return this.eventsService.findAllUserEvents(paginationDto, sortDto)
  }
}
