import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Relationships } from '@/models'

export type SelectRelationships = InferSelectModel<typeof Relationships>
export type InsertRelationships = InferInsertModel<typeof Relationships>
