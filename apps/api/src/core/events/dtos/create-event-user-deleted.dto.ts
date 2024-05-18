import { PickType } from '@nestjs/swagger'
import { CreateEventDto } from 'shared'

export class CreateEventUserDeletedDto extends PickType(CreateEventDto, [
  'userId',
  'data',
] as const) {
  constructor(event: CreateEventUserDeletedDto) {
    super()
    this.userId = event.userId
    this.data = event.data
  }
}
