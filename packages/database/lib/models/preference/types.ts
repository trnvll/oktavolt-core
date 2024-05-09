import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Preferences } from '@/models'

export type SelectPreferences = InferSelectModel<typeof Preferences>
export type InsertPreferences = InferInsertModel<typeof Preferences>
