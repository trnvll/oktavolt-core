import { EventDetails } from 'shared'
import { SelectUser } from 'database'

export class CreateEventUserCreatedDto {
  userId: number
  data: EventDetails

  constructor(event: CreateEventUserCreatedDto) {
    this.userId = event.userId
    this.data = event.data
  }
}

export class CreateEventUserCreatedJob {
  user: SelectUser
  data: EventDetails

  constructor(event: CreateEventUserCreatedJob) {
    this.user = event.user
    this.data = event.data
  }
}
