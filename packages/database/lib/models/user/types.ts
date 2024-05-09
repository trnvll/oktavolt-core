import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Users } from '@/models'

export type SelectUser = InferSelectModel<typeof Users>
export type InsertUser = InferInsertModel<typeof Users>
