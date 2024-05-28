import { Controller, Get, Post } from '@nestjs/common'
import { EventsService } from '@/modules/events/services/events.service'
import { CreateEventDto } from 'shared'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  createUserEvent(userEventDto: CreateEventDto) {
    return this.eventsService.createUserEvent(userEventDto)
  }

  @Get()
  findAllUserEvents() {
    return this.eventsService.findAllUserEvents()
  }
}
