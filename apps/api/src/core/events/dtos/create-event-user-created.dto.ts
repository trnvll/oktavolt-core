import { EventDetails } from 'shared'
import { SelectUser } from 'database'

export class CreateEventUserCreatedDto {
  user: SelectUser
  data: EventDetails

  constructor(event: CreateEventUserCreatedDto) {
    this.user = event.user
    this.data = event.data
  }
}
