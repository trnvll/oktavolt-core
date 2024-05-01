import { Profile, User } from '@prisma/client'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: User['email']

  @IsString()
  @IsNotEmpty()
  username: User['username']

  @IsString()
  @IsNotEmpty()
  auth0Id: User['auth0Id']

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: User['phoneNumber']

  @IsString()
  @IsNotEmpty()
  firstName: Profile['firstName']

  @IsString()
  @IsNotEmpty()
  lastName: Profile['lastName']

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location: Profile['location']
}
