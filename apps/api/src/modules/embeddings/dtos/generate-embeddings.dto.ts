import { IsNotEmpty, IsString } from 'class-validator'

export class GenerateEmbeddingsDto {
  @IsString()
  @IsNotEmpty()
  content: string
}

export class GenerateEmbeddingsResponseDto {
  embeddings: number[][]

  static fromEntity(embeddings: number[][]): GenerateEmbeddingsResponseDto {
    return {
      embeddings,
    }
  }
}
