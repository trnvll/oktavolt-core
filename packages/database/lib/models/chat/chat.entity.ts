import { integer, pgTable, serial, text, primaryKey } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user.entity'
import { timestamps } from '@/utils/timestamps'
import { ChatTypeEnum, ConversationTypeEnum } from '@/models/chat/enums'
import { ToolExecs } from '@/models'

export const Conversations = pgTable('conversations', {
  ...timestamps,
  convId: serial('conversation_id').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId, { onDelete: 'cascade' }),
  type: text('type').notNull().$type<ConversationTypeEnum>(),
})

export const Chats = pgTable('chats', {
  ...timestamps,
  chatId: serial('chat_id').notNull().primaryKey(),
  convId: integer('conversation_id')
    .notNull()
    .references(() => Conversations.convId, { onDelete: 'cascade' }),
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
    ...timestamps,
  },
  (t) => ({
    pk: primaryKey({ columns: [t.chatId, t.toolExecId] }),
  }),
)
