import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'
import { Chats } from '@/models'
import { ToolExecStatus } from '@/models/tool-exec/enums'

export const ToolExecs = pgTable('tool_executions', {
  ...timestamps,
  toolExecId: serial('tool_exec_id').notNull().primaryKey(),
  chatId: integer('chat_id')
    .notNull()
    .references(() => Chats.chatId, { onDelete: 'cascade' }),
  status: text('status').notNull().$type<ToolExecStatus>(),
  toolName: text('tool_name').notNull(), // TODO: worth keeping track of versions in future
  executionData: jsonb('execution_data').notNull(),
  executedAt: timestamp('executed_at'),
})
