import { IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class QueryEmbeddingsDto {
  @IsString()
  @Transform(({ value }) => (value ? decodeURIComponent(value) : undefined))
  query: string
}
