import { SelectUserEvent } from 'tsdb'
import { instanceToPlain } from 'class-transformer'

export class FindAllUserEventsMapper {
  static fromEntity(userEvents: SelectUserEvent[]) {
    return userEvents.map(FindUserEventsMapper.fromEntity)
  }
}

export class FindUserEventsMapper {
  static fromEntity(userEvent: SelectUserEvent) {
    return instanceToPlain(userEvent)
  }
}
