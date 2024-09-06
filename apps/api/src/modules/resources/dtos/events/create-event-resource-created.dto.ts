import { CreateResourceDto } from '@/modules/resources/dtos/create-resource.dto'
import { SelectUser } from 'database'

export class CreateEventResourceCreatedDto {
  data: CreateResourceDto
  userId: SelectUser['userId']

  constructor(event: CreateEventResourceCreatedDto) {
    this.data = event.data
    this.userId = event.userId
  }
}
