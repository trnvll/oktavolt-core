import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { OmniService } from '@/modules/omni/services/omni.service'
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { CreateChatDto } from '@/modules/chats/dtos/create-chat.dto'

@Controller('users/:userId/omni')
export class OmniController {
  constructor(private readonly omniService: OmniService) {}

  @Post()
  async omni(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body() chatDto: CreateChatDto,
  ) {
    return this.omniService.omni(user, chatDto)
  }

  @Get()
  async openapi(@Query('query') query: string) {
    return this.omniService.openapi(query)
  }
}
