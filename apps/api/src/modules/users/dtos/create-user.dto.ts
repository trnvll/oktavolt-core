import {
  IsArray,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { InsertUser } from 'database'
import { Transform, Type } from 'class-transformer'
import { LogActivity } from 'utils'

export class CreateUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  data: CreateUserDto[]

  @LogActivity({ level: 'debug' })
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
