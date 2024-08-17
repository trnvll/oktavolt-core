import { IsString, IsObject, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { InsertResources } from 'database'

export class CreateResourceDto {
  @IsString()
  content: string

  @IsObject()
  @IsOptional()
  @Type(() => Object)
  metadata?: Record<string, any>

  static toEntity(
    dto: CreateResourceDto,
    rest: Pick<InsertResources, 'embedding' | 'userId'>,
  ): InsertResources {
    return {
      userId: rest.userId,
      content: dto.content,
      metadata: dto.metadata,
      embedding: rest.embedding,
    }
  }
}
