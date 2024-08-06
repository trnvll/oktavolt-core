import { IsString } from 'class-validator'

export class OmniQueryDto {
  @IsString()
  query: string
}
