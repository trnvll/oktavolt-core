import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { ChatsModule } from '@/modules/chats/chats.module'
import { SlackChatsController } from '@/modules/slack/controllers/slack-chats.controller'

@Module({
  imports: [DatabaseModule, ChatsModule],
  controllers: [SlackChatsController],
  providers: [],
  exports: [],
})
export class SlackModule {}
