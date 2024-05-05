import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const Preferences = pgTable('preferences', {
  prefId: serial('pref_id').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId),
  preferenceType: text('preference_type').notNull(),
  value: text('value'),
})

export type SelectPreferences = InferSelectModel<typeof Preferences>
export type InsertPreferences = InferInsertModel<typeof Preferences>
