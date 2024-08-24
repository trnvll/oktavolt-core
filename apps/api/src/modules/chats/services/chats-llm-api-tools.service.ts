import { Injectable } from '@nestjs/common'
import { GetLlmTool } from '@/types/tools/get-llm-tools'
import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { validateToolDto } from '@/utils/fns/validate-tool-dto'
import { PaginationDto, SearchDto, SortDto, SortOrderEnum } from 'shared'
import { ChatSortFields } from '@/modules/chats/types/chat-sort-fields'
import { ChatsService } from '@/modules/chats/services/chats.service'

@Injectable()
export class ChatsLlmApiToolsService {
  constructor(private readonly chatsService: ChatsService) {}

  getTools(): GetLlmTool['tool'][] {
    return this.getToolDefs().map((def) => def.tool)
  }

  getToolDefs(): GetLlmTool[] {
    return [
      {
        raw: true,
        tool: new DynamicStructuredTool({
          name: 'FindAllChats',
          description: 'Find all user chats with pagination and sorting',
          schema: z.object({
            userId: z.number().int().positive(),
            page: z.number().int().min(1).positive(),
            limit: z.number().int().positive(),
            sortBy: z.nativeEnum(ChatSortFields),
            sortOrder: z.nativeEnum(SortOrderEnum),
            query: z
              .string()
              .optional()
              .describe('Search query to find user chats by content'),
          }),
          func: async (input) => {
            const sortDto = await validateToolDto(SortDto<ChatSortFields>, {
              sortBy: input.sortBy,
              sortOrder: input.sortOrder,
            })
            const paginationDto = await validateToolDto(PaginationDto, {
              page: input.page,
              limit: input.limit,
            })
            const searchDto = await validateToolDto(SearchDto, {
              query: input.query,
            })
            return await this.chatsService.findAll(
              { userId: input.userId },
              paginationDto,
              sortDto,
              searchDto,
            )
          },
        }),
      },
    ]
  }
}
