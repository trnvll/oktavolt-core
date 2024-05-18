import { IsString } from 'class-validator'

export class MetadataDto {
  @IsString()
  ipAddress: string;
  [key: string]: any
}
