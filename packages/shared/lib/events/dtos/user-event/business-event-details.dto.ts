import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { DataChangeDto, EntityTypeEnum, MetadataDto } from '@/events'

export class BusinessEventDetailsDto {
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto

  @IsString()
  action: string

  @IsEnum(EntityTypeEnum)
  entityType: EntityTypeEnum

  @IsString()
  entityId: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DataChangeDto)
  dataChange?: DataChangeDto
}
