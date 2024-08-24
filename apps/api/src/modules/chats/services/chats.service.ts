import { Injectable } from '@nestjs/common'
import { SelectUser } from 'database'
import { PaginationDto, SearchDto, SortDto } from 'shared'
import { ChatSortFields } from '@/modules/chats/types/chat-sort-fields'
import { ChatsQueryService } from '@/modules/chats/services/queries/chats-query.service'

@Injectable()
export class ChatsService {
  constructor(private readonly chatsQueryService: ChatsQueryService) {}

  async findAll(
    user: Pick<SelectUser, 'userId'>,
    paginationDto: PaginationDto,
    sortDto: SortDto<ChatSortFields>,
    searchDto: SearchDto,
  ) {
    return this.chatsQueryService.findAllChats(
      user,
      paginationDto,
      sortDto,
      searchDto,
    )
  }
}
