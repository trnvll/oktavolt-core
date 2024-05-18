import { PickType } from '@nestjs/swagger'
import { CreateEventDto } from 'shared'

export class CreateEventUserDataUpdatedDto extends PickType(CreateEventDto, [
  'userId',
  'data',
] as const) {
  constructor(event: CreateEventUserDataUpdatedDto) {
    super()
    this.userId = event.userId
    this.data = event.data
  }
}
