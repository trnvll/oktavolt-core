import { Injectable } from '@nestjs/common'
import { CreateEventDto } from '@/modules/events/dtos/create-event.dto'

@Injectable()
export class EventsService {
  constructor() {}

  async createEvent(eventDto: CreateEventDto) {
    console.log('Event created')
  }
}
