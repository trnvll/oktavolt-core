import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator'
import { InsertUser } from 'database'
import { Transform } from 'class-transformer'

export class CreateUserDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  phone: string

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  dateOfBirth: Date

  @IsOptional()
  @IsString()
  context?: string

  static toEntity(dto: CreateUserDto): InsertUser {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      dob: dto.dateOfBirth,
      context: dto.context,
    }
  }
}
