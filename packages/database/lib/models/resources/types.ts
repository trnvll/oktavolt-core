import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Resources } from '@/models'

export type SelectResources = InferSelectModel<typeof Resources>
export type InsertResources = InferInsertModel<typeof Resources>
