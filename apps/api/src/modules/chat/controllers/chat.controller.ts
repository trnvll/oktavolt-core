import { Controller, Get, Query } from '@nestjs/common'
import { ChatService } from '@/modules/chat/services/chat.service'

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async chat(@Query('message') message: string) {
    return this.chatService.chat(message)
  }
}
