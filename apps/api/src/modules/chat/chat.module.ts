import { Module } from '@nestjs/common'
import { ChatService } from '@/modules/chat/services/chat.service'
import { ChatController } from '@/modules/chat/controllers/chat.controller'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, LlmChatService],
  exports: [ChatService],
})
export class ChatModule {}
