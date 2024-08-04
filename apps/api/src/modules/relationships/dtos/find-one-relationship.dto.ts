import { SelectRelationships } from 'database'
import { RelationshipTypeEnum } from '@/patch/enums/external'

export class FindOneRelationshipDto {
  relationshipId: number
  name: string
  relationType: RelationshipTypeEnum
  email: string | null
  phone: string | null
  address: string | null
  notes: string | null

  static fromEntity(entity: SelectRelationships): FindOneRelationshipDto {
    const dto = new FindOneRelationshipDto()
    dto.relationshipId = entity.relationshipId
    dto.name = entity.name
    dto.relationType = entity.relationType as any
    dto.email = entity.email
    dto.phone = entity.phone
    dto.address = entity.address
    dto.notes = entity.notes
    return dto
  }
}
