import { SelectCommunications } from 'database'

export class FindOneCommDto {
  commId: number
  type: any
  content: string
  timestamp: Date | null
  sender: string | null
  receiver: string
  provider: any

  static fromEntity(entity: SelectCommunications) {
    const dto = new FindOneCommDto()

    dto.commId = entity.commId
    dto.type = entity.type
    dto.content = entity.content
    dto.timestamp = entity.timestamp
    dto.sender = entity.sender
    dto.receiver = entity.receiver
    dto.provider = entity.provider

    return dto
  }
}
