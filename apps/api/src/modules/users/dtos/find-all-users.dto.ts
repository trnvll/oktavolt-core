import { SelectUser } from 'database'
import { FindOneUserDto } from '@/modules/users/dtos/find-one-user.dto'
import { LogActivity } from 'utils'

export class FindAllUsersDto {
  @LogActivity({ level: 'debug' })
  static fromEntity(entities: SelectUser[]) {
    return entities.map(FindOneUserDto.fromEntity)
  }
}
