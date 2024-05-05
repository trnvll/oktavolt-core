import { FindOneAuthDto } from './find-one-auth.dto'
import { SelectAuthentication } from 'database'

export class FindAllAuthsDto {
  static fromEntity(entities: SelectAuthentication[]): FindOneAuthDto[] {
    return entities.map(FindOneAuthDto.fromEntity)
  }
}
