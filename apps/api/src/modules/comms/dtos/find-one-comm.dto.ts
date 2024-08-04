import { SelectCommunications } from 'database'
import {
  CommunicationProviderEnum,
  CommunicationTypeEnum,
} from '@/patch/enums/external'

export class FindOneCommDto {
  commId: number
  type: CommunicationTypeEnum
  content: string
  timestamp: Date | null
  sender: string | null
  receiver: string
  provider: CommunicationProviderEnum

  static fromEntity(entity: SelectCommunications) {
    const dto = new FindOneCommDto()

    dto.commId = entity.commId
    dto.type = entity.type as any
    dto.content = entity.content
    dto.timestamp = entity.timestamp
    dto.sender = entity.sender
    dto.receiver = entity.receiver
    dto.provider = entity.provider as any

    return dto
  }
}
