import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { DataChangeDto, MetadataDto } from '@/events/dtos/user-event/core'
import {
  EventActionEnum,
  EntityTypeEnum,
} from '@/events/dtos/user-event/core/enums'

export class BusinessEventDetailsDto {
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto

  @IsEnum(EventActionEnum)
  action: EventActionEnum

  @IsEnum(EntityTypeEnum)
  entityType: EntityTypeEnum

  @IsArray()
  @IsInt({ each: true })
  entityIds: number[]

  @IsOptional()
  @ValidateNested()
  @Type(() => DataChangeDto)
  dataChange?: DataChangeDto
}
