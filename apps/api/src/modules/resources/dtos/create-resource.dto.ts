import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { InsertResources } from 'database'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'

export class CreateResourceDto {
  @IsString()
  content: string

  @IsEnum(LlmConversationTypeEnum)
  type: LlmConversationTypeEnum

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
      type: dto.type as any,
    }
  }
}
