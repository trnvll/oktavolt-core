import { integer, pgTable, serial, text, primaryKey } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user.entity'
import { timestamps } from '@/utils/timestamps'
import { ChatTypeEnum } from '@/models/chat/enums'
import { ToolExecs } from '@/models'

export const Chats = pgTable('chats', {
  ...timestamps,
  chatId: serial('chat_id').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId, { onDelete: 'cascade' }),
  type: text('type').notNull().$type<ChatTypeEnum>(),
  content: text('content').notNull(),
})

export const ChatsToToolExecs = pgTable(
  'chats_to_tool_executions',
  {
    chatId: integer('chat_id')
      .notNull()
      .references(() => Chats.chatId, { onDelete: 'cascade' }),
    toolExecId: integer('tool_exec_id')
      .notNull()
      .references(() => ToolExecs.toolExecId, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.chatId, t.toolExecId] }),
  }),
)
