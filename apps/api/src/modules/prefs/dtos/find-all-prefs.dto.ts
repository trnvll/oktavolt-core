import { SelectPreferences } from 'database'
import { FindOnePrefDto } from '@/modules/prefs/dtos/find-one-pref.dto'

export class FindAllPrefsDto {
  static fromEntity(entities: SelectPreferences[]) {
    return entities.map(FindOnePrefDto.fromEntity)
  }
}
