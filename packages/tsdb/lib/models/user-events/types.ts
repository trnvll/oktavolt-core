import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { UserEvents } from '@/models'

export type SelectUserEvent = InferSelectModel<typeof UserEvents>
export type InsertUserEvent = InferInsertModel<typeof UserEvents>
