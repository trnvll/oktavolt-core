import { PickType } from '@nestjs/swagger'
import { CreateEventDto } from 'shared'

export class CreateEventUserCreatedDto extends PickType(CreateEventDto, [
  'userId',
  'data',
] as const) {
  constructor(event: CreateEventUserCreatedDto) {
    super()
    this.userId = event.userId
    this.data = event.data
  }
}
