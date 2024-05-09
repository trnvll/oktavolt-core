import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Communications } from '@/models'

export type SelectCommunications = InferSelectModel<typeof Communications>
export type InsertCommunications = InferInsertModel<typeof Communications>
