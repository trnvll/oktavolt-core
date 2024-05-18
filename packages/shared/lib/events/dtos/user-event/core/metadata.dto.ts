import { IsOptional, IsString } from 'class-validator'

export class MetadataDto {
  @IsOptional()
  @IsString()
  ipAddress?: string;
  [key: string]: any
}
