import { SelectUser } from 'database'

export class FindOneUserDto {
  name: string
  email: string
  phone: string
  dateOfBirth: Date
  createdAt: Date

  static fromEntity(entity: SelectUser) {
    const dto = new FindOneUserDto()

    dto.name = entity.name
    dto.email = entity.email
    dto.phone = entity.phone
    dto.dateOfBirth = entity.dob
    dto.createdAt = entity.createdAt

    return dto
  }
}
