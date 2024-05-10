import { SelectRelationships } from 'database'
import { FindOneRelationshipDto } from '@/modules/relationships/dtos/find-one-relationship.dto'
import { LogActivity } from 'utils'

export class FindAllRelationshipsDto {
  @LogActivity({ level: 'debug' })
  static fromEntity(entities: SelectRelationships[]) {
    return entities.map(FindOneRelationshipDto.fromEntity)
  }
}
