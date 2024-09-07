import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ChatsLlmService } from '@/modules/chats/services/chats-llm.service'
import { FindUserByIdPipe } from '@/modules/users/pipes/find-user-by-id.pipe'
import { SelectUser } from 'database'
import { AuthGuard } from '@nestjs/passport'
import { AnalyticsInterceptor } from '@/utils/interceptors/analytics.interceptor'
import { ConversationDto } from '@/modules/chats/dtos/conversation.dto'
import { PaginationDto, SearchDto, SortDto } from 'shared'
import { ChatSortFields } from '@/modules/chats/types/chat-sort-fields'
import { ChatsService } from '@/modules/chats/services/chats.service'
import { AppRequestInterface } from '@/types/app-request.interface'

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(AnalyticsInterceptor)
@Controller('users/:userId/chats')
export class ChatsController {
  constructor(
    private readonly chatsLlmService: ChatsLlmService,
    private readonly chatsService: ChatsService,
  ) {}

  @Post()
  async chat(
    @Param('userId', FindUserByIdPipe) user: SelectUser,
    @Body() convDto: ConversationDto,
    @Req() request: AppRequestInterface,
  ) {
    return this.chatsLlmService.chat(user, convDto, request)
  }

  @Get()
  async findAll(
    @Param('userId', FindUserByIdPipe) user: Pick<SelectUser, 'userId'>,
    @Body() paginationDto: PaginationDto,
    @Body() sortDto: SortDto<ChatSortFields>,
    @Body() searchDto: SearchDto,
  ) {
    return this.chatsService.findAll(user, paginationDto, sortDto, searchDto)
  }
}
