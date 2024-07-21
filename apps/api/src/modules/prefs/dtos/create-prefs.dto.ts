import { IsString, ValidateNested, IsOptional, IsArray } from 'class-validator'
import { Type } from 'class-transformer'
import { InsertPreferences } from 'database'
import { LogActivity } from 'utils'

export class CreatePrefsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrefDto)
  data: CreatePrefDto[]

  @LogActivity({ level: 'debug' })
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
