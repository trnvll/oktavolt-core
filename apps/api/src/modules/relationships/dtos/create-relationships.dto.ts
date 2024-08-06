import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { InsertRelationships } from 'database'
import { Type } from 'class-transformer'
import { RelationshipTypeEnum } from '@/patch/enums/external'

export class CreateRelationshipsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @Type(() => CreateRelationshipDto)
  data: CreateRelationshipDto[]

  static toEntity(userId: number, dto: CreateRelationshipDto[]) {
    return dto.map((relation) =>
      CreateRelationshipDto.toEntity(userId, relation),
    )
  }
}

export class CreateRelationshipDto {
  @IsString()
  name: string

  @IsEnum(RelationshipTypeEnum)
  relationType: RelationshipTypeEnum

  @IsEmail()
  @IsOptional()
  email?: string

  // @IsPhoneNumber()
  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  address?: string

  @IsString()
  @IsOptional()
  context?: string

  static toEntity(
    userId: number,
    dto: CreateRelationshipDto,
  ): InsertRelationships {
    return {
      userId,
      name: dto.name,
      relationType: dto.relationType as any,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      context: dto.context,
    }
  }
}
