import {
  IsString,
  ValidateNested,
  IsOptional,
  IsArray,
  ArrayMaxSize,
} from 'class-validator'
import { Type } from 'class-transformer'
import { InsertPreferences } from 'database'

export class CreatePrefsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @Type(() => CreatePrefDto)
  data: CreatePrefDto[]

  static toEntity(userId: number, dto: CreatePrefDto[]) {
    return dto.map((pref) => CreatePrefDto.toEntity(userId, pref))
  }
}

export class CreatePrefDto {
  @IsString()
  preferenceType: string

  @IsOptional()
  @IsString()
  value?: string

  @IsOptional()
  @IsString()
  context?: string

  static toEntity(userId: number, dto: CreatePrefDto): InsertPreferences {
    return {
      userId,
      preferenceType: dto.preferenceType,
      value: dto.value,
      context: dto.context,
    }
  }
}
