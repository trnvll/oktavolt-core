import { UsersRepository } from '@/modules/users/users.repository'
import { ART } from '@/types/general'

export class UserResponseDto {
  id: number
  email: string
  username: string
  phoneNumber: string | null
  auth0Id: string
  createdAt: Date
  firstName?: string
  lastName?: string
  location?: string | null

  static fromEntity(user: ART<UsersRepository['findUser']>): UserResponseDto {
    const dto = new UserResponseDto()
    dto.id = user?.id
    dto.email = user.email
    dto.username = user.username
    dto.phoneNumber = user.phoneNumber
    dto.auth0Id = user.auth0Id
    dto.createdAt = user.createdAt
    dto.firstName = user.profile?.firstName
    dto.lastName = user.profile?.lastName
    dto.location = user.profile?.location
    return dto
  }
}
