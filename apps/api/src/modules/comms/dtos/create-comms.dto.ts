import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import {
  CommunicationTypeEnum,
  CommunicationProviderEnum,
  InsertCommunications,
} from 'database'
import { Transform, Type } from 'class-transformer'
import { LogActivity } from 'utils'

export class CreateCommsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommDto)
  data: CreateCommDto[]

  @LogActivity({ level: 'debug' })
  static toEntity(userId: number, dto: CreateCommDto[]) {
    return dto.map((comm) => CreateCommDto.toEntity(userId, comm))
  }
}

export class CreateCommDto {
  @IsEnum(CommunicationTypeEnum)
  type: CommunicationTypeEnum

  @IsString()
  content: string

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  timestamp?: Date

  @IsOptional()
  @IsString()
  sender?: string

  @IsString()
  receiver: string

  @IsEnum(CommunicationProviderEnum)
  provider: CommunicationProviderEnum

  static toEntity(userId: number, dto: CreateCommDto): InsertCommunications {
    return {
      userId,
      type: dto.type,
      content: dto.content,
      sender: dto.sender,
      receiver: dto.receiver,
      provider: dto.provider,
      timestamp: dto.timestamp,
    }
  }
}
