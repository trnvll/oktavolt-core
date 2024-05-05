import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator'
import { InsertRelationships, RelationshipTypeEnum } from 'database'
import { Type } from 'class-transformer'

export class CreateRelationshipsDto {
  @IsArray()
  @ValidateNested({ each: true })
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

  @IsPhoneNumber()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  address?: string

  @IsString()
  @IsOptional()
  notes?: string

  static toEntity(
    userId: number,
    dto: CreateRelationshipDto,
  ): InsertRelationships {
    return {
      userId,
      name: dto.name,
      relationType: dto.relationType,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      notes: dto.notes,
    }
  }
}
