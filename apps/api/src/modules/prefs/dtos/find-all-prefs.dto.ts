import { SelectPreferences } from 'database'
import { FindOnePrefDto } from '@/modules/prefs/dtos/find-one-pref.dto'
import { LogActivity } from 'utils'

export class FindAllPrefsDto {
  @LogActivity({ level: 'debug' })
  static fromEntity(entities: SelectPreferences[]) {
    return entities.map(FindOnePrefDto.fromEntity)
  }
}
