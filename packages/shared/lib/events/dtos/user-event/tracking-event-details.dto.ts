import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { MetadataDto } from '@/events'

export class TrackingEventDetailsDto {
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto

  @IsString()
  action: string

  @IsOptional()
  @IsString()
  campaignId?: string

  @IsOptional()
  @IsString()
  pageUrl?: string

  @IsOptional()
  @IsString()
  referrer?: string
}
