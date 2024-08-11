import { jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'
import { ToolExecStatus } from '@/models/tool-exec/enums'

export const ToolExecs = pgTable('tool_executions', {
  ...timestamps,
  toolExecId: serial('tool_exec_id').notNull().primaryKey(),
  status: text('status').notNull().$type<ToolExecStatus>(),
  toolName: text('tool_name').notNull(), // TODO: worth keeping track of versions in future
  executionData: jsonb('execution_data').notNull(),
  response: jsonb('response'),
  executedAt: timestamp('executed_at'),
})
