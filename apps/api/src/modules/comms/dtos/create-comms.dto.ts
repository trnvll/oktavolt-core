import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { InsertCommunications } from 'database'
import { Transform, Type } from 'class-transformer'
import {
  CommunicationProviderEnum,
  CommunicationTypeEnum,
} from '@/patch/enums/external'

export class CreateCommsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @Type(() => CreateCommDto)
  data: CreateCommDto[]

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
      type: dto.type as any,
      content: dto.content,
      sender: dto.sender,
      receiver: dto.receiver,
      provider: dto.provider as any,
      timestamp: dto.timestamp,
    }
  }
}
