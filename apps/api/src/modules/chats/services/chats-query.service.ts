import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { Conversations } from 'database'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'

@Injectable()
export class ChatsQueryService {
  constructor(private readonly database: DatabaseService) {}

  async createConv(userId: number, type: LlmConversationTypeEnum) {
    const convsResult = await this.database.db
      .insert(Conversations)
      .values({
        userId,
        type: type as any,
      })
      .returning({ convId: Conversations.convId, type: Conversations.type })
    return convsResult[0]
  }
}
