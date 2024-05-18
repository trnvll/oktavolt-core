import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator'
import { instanceToPlain, Type } from 'class-transformer'
import { InsertAuthentication, SelectAuthentication } from 'database'
import { LogActivity } from 'utils'

export class CreateAuthsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAuthDto)
  data: CreateAuthDto[]

  @LogActivity({ level: 'debug' })
  static toEntity(userId: number, dto: CreateAuthDto[]) {
    return dto.map((auth) => CreateAuthDto.toEntity(userId, auth))
  }

  @LogActivity({ level: 'debug' })
  static fromEntity(entities: SelectAuthentication[]) {
    return entities.map((auth) => CreateAuthDto.fromEntity(auth))
  }
}

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  serviceName: string

  @IsNotEmpty()
  @IsString()
  serviceDomain: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsNotEmpty()
  @IsString()
  password: string

  static toEntity(userId: number, dto: CreateAuthDto): InsertAuthentication {
    // TODO: create hashed password
    const hashedPassword = dto.password
    return {
      userId,
      serviceName: dto.serviceName,
      serviceDomain: dto.serviceDomain,
      email: dto.email,
      hashedPassword,
    }
  }

  static fromEntity(entity: SelectAuthentication) {
    return instanceToPlain(entity)
  }
}
