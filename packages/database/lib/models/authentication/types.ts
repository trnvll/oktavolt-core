import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Authentication } from '@/models'

export type SelectAuthentication = InferSelectModel<typeof Authentication>
export type InsertAuthentication = InferInsertModel<typeof Authentication>
