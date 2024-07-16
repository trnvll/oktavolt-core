import { IsNotEmpty, IsString } from 'class-validator'

export class GenerateEmbeddingsDto {
  @IsString()
  @IsNotEmpty()
  content: string
}
