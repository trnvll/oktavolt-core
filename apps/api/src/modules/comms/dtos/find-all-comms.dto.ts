import { SelectCommunications } from 'database'
import { FindOneCommDto } from '@/modules/comms/dtos/find-one-comm.dto'
import { LogActivity } from 'utils'

export class FindAllCommsDto {
  @LogActivity({ level: 'debug' })
  static fromEntity(entities: SelectCommunications[]) {
    return entities.map(FindOneCommDto.fromEntity)
  }
}
