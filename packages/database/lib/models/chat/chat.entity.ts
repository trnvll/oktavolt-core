import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user.entity'
import { timestamps } from '@/utils/timestamps'
import { ChatTypeEnum } from '@/models/chat/enums'

export const Chats = pgTable('chats', {
  ...timestamps,
  chatId: serial('chat_id').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId, { onDelete: 'cascade' }),
  type: text('type').notNull().$type<ChatTypeEnum>(),
  content: text('content').notNull(),
})
