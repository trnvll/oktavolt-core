import { SelectCommunications } from 'database'
import { FindOneCommDto } from '@/modules/comms/dtos/find-one-comm.dto'

export class FindAllCommsDto {
  static fromEntity(entities: SelectCommunications[]) {
    return entities.map(FindOneCommDto.fromEntity)
  }
}
