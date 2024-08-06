import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { ToolExecs } from '@/models/tool-exec/tool-exec.entity'

export type SelectToolExec = InferSelectModel<typeof ToolExecs>
export type InsertToolExec = InferInsertModel<typeof ToolExecs>
