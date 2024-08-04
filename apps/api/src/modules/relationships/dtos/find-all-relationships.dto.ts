import { SelectRelationships } from 'database'
import { FindOneRelationshipDto } from '@/modules/relationships/dtos/find-one-relationship.dto'

export class FindAllRelationshipsDto {
  static fromEntity(entities: SelectRelationships[]) {
    return entities.map(FindOneRelationshipDto.fromEntity)
  }
}
