import { Body, Controller, Post } from '@nestjs/common'
import { json } from 'shared'

@Controller('slack/chats')
export class SlackChatsController {
  constructor() {}

  @Post()
  async chat(@Body() body: any) {
    console.log('BODY', json(body))
    // return this.chatsLlmService.chat()
    return {
      response_type: 'in_channel',
      text: body,
    }
  }
}
