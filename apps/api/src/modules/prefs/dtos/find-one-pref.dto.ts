import { SelectPreferences } from 'database'

export class FindOnePrefDto {
  prefId: number
  userId: number
  preferenceType: string
  value: string | null

  static fromEntity(entity: SelectPreferences): FindOnePrefDto {
    const dto = new FindOnePrefDto()
    dto.prefId = entity.prefId
    dto.userId = entity.userId
    dto.preferenceType = entity.preferenceType
    dto.value = entity.value
    return dto
  }
}
