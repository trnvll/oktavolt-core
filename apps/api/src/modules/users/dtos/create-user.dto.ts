import { IsDate, IsEmail, IsPhoneNumber, IsString } from 'class-validator'
import { InsertUser } from 'database'
import { Transform } from 'class-transformer'

export class CreateUserDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsPhoneNumber()
  phone: string

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  dateOfBirth: Date

  static toEntity(dto: CreateUserDto): InsertUser {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      dob: dto.dateOfBirth,
    }
  }
}
