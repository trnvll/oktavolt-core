import { SelectUser } from 'database'
import { FindOneUserDto } from '@/modules/users/dtos/find-one-user.dto'

export class FindAllUsersDto {
  static fromEntity(entities: SelectUser[]) {
    return entities.map(FindOneUserDto.fromEntity)
  }
}
