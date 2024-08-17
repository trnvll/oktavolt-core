import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { Conversations } from 'database'

@Injectable()
export class ChatsQueryService {
  constructor(private readonly database: DatabaseService) {}

  async createConv(userId: number) {
    const convsResult = await this.database.db
      .insert(Conversations)
      .values({
        userId,
      })
      .returning({ convId: Conversations.convId })
    return convsResult[0].convId
  }
}
