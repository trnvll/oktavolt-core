import { SelectAuthentication } from 'database'
import { LogActivity } from 'utils'
import { FindOneAuthDto } from '@/modules/auth/dtos/find-one-auth.dto'

export class FindAllAuthsDto {
  @LogActivity({ level: 'debug' })
  static fromEntity(entities: SelectAuthentication[]): FindOneAuthDto[] {
    return entities.map(FindOneAuthDto.fromEntity)
  }
}
