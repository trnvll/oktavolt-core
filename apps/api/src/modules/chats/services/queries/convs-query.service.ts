import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { Chats, ChatsToToolExecs, Conversations, ToolExecs } from 'database'
import { and, asc, desc, eq } from 'drizzle-orm'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'

@Injectable()
export class ConvsQueryService {
  constructor(private readonly database: DatabaseService) {}

  recentConvs(userId: number, convType: LlmConversationTypeEnum, limit = 3) {
    return this.database.db
      .select({
        convId: Conversations.convId,
        createdAt: Conversations.createdAt,
      })
      .from(Conversations)
      .where(
        and(
          eq(Conversations.userId, userId),
          eq(Conversations.type, convType as any),
        ),
      )
      .orderBy(desc(Conversations.createdAt))
      .limit(limit)
  }

  chatsByConvId(convId: number) {
    return this.database.db
      .select({
        content: Chats.content,
        type: Chats.type,
        chatId: Chats.chatId,
        toolExecData: ToolExecs.executionData,
        toolExecResponse: ToolExecs.response,
        createdAt: Chats.createdAt,
      })
      .from(Chats)
      .leftJoin(ChatsToToolExecs, eq(ChatsToToolExecs.chatId, Chats.chatId))
      .leftJoin(
        ToolExecs,
        eq(ToolExecs.toolExecId, ChatsToToolExecs.toolExecId),
      )
      .where(eq(Chats.convId, convId))
      .orderBy(asc(Chats.createdAt))
  }
}
