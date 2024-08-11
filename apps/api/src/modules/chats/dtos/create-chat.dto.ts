import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { InsertChat } from 'database'
import { ChatTypeEnum } from '@/patch/enums/external'

export class CreateChatDto {
  @IsString()
  message: string

  @IsOptional()
  @IsEnum(ChatTypeEnum)
  type = ChatTypeEnum.Human

  @IsOptional()
  @IsBoolean()
  useTools = true // TODO: optional tools, history, similarity etc

  @IsOptional()
  @IsBoolean()
  useChatContext = true

  @IsOptional()
  @IsBoolean()
  toolExecRawResponse = false

  static toEntity(userId: number, dto: CreateChatDto): InsertChat {
    return {
      userId,
      content: dto.message,
      type: dto.type as any,
    }
  }
}
