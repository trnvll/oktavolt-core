import { EventDetails } from 'shared'
import { SelectUser } from 'database'

export class CreateEventUserDataUpdatedDto {
  userId: number
  data: EventDetails

  constructor(event: CreateEventUserDataUpdatedDto) {
    this.userId = event.userId
    this.data = event.data
  }
}

export class CreateEventUserDataUpdatedJob {
  user: SelectUser
  data: EventDetails

  constructor(event: CreateEventUserDataUpdatedJob) {
    this.user = event.user
    this.data = event.data
  }
}
