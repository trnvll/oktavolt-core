import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ChatTypeEnum } from '@/patch/enums/external'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'
import { InsertChat } from 'database'

export class ConversationDto {
  @IsString()
  message: string

  @IsOptional()
  @IsEnum(ChatTypeEnum)
  chatType = ChatTypeEnum.Human

  @IsOptional()
  @IsEnum(LlmConversationTypeEnum)
  convType = LlmConversationTypeEnum.Personal

  static toChatEntity(convId: number, dto: ConversationDto): InsertChat {
    return {
      convId,
      content: dto.message,
      type: dto.chatType as any,
    }
  }
}
