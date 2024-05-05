import { SelectUser } from 'database'

export class FindOneUserDto {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date
  createdAt: Date

  static fromEntity(entity: SelectUser) {
    const dto = new FindOneUserDto()

    dto.firstName = entity.firstName
    dto.lastName = entity.lastName
    dto.email = entity.email
    dto.phone = entity.phone
    dto.dateOfBirth = entity.dob
    dto.createdAt = entity.createdAt

    return dto
  }
}
