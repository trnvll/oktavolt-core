// find-one-auth.dto.ts
import { SelectAuthentication } from 'database'

export class FindOneAuthDto {
  authId: number
  userId: number
  email: string | null
  password: string | null
  serviceName: string
  serviceDomain: string
  createdAt: Date
  updatedAt: Date | null

  static fromEntity(entity: SelectAuthentication): FindOneAuthDto {
    const password = entity.hashedPassword // TODO: decrypt password

    const dto = new FindOneAuthDto()
    dto.authId = entity.authId
    dto.userId = entity.userId
    dto.email = entity.email
    dto.password = password
    dto.serviceName = entity.serviceName
    dto.serviceDomain = entity.serviceDomain
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    return dto
  }
}
