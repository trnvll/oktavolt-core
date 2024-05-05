import {
  IsArray,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator'
import { InsertUser } from 'database'
import { Transform, Type } from 'class-transformer'

export class CreateUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  data: CreateUserDto[]

  static toEntity(dto: CreateUserDto[]) {
    return dto.map(CreateUserDto.toEntity)
  }
}

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
