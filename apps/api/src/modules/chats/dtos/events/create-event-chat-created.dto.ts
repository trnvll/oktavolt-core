import { SelectChat } from 'database'

export class CreateEventChatCreatedDto {
  data: SelectChat

  constructor(event: CreateEventChatCreatedDto) {
    this.data = event.data
  }
}
