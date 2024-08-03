import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ChatsService } from '@/modules/chats/services/chats.service'
import { CreateChatsDto } from '@/modules/chats/dtos/create-chat.dto'
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { AuthGuard } from '@nestjs/passport'
import { AnalyticsInterceptor } from '@/utils/interceptors/analytics.interceptor'

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(AnalyticsInterceptor)
@Controller('users/:userId/chats')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Post()
  async chat(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body() chatDto: CreateChatsDto,
  ) {
    return this.chatService.chat(user, chatDto)
  }
}
