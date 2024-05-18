import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { UserEvents } from '@/models'

export type SelectAuthentication = InferSelectModel<typeof UserEvents>
export type InsertAuthentication = InferInsertModel<typeof UserEvents>
