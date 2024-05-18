import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { EntityTypeEnum } from '@/modules/events/dtos/core/enums'
import { Type } from 'class-transformer'
import { MetadataDto } from '@/modules/events/dtos/core/metadata.dto'
import { DataChangeDto } from '@/modules/events/dtos/core/data-change.dto'

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
