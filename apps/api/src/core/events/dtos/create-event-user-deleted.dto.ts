import { EventDetails } from 'shared'

export class CreateEventUserDeletedDto {
  userId: number
  data: EventDetails

  constructor(event: CreateEventUserDeletedDto) {
    this.userId = event.userId
    this.data = event.data
  }
}
