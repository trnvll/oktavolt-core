import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user'

export const Preferences = pgTable('preferences', {
  prefId: serial('pref_id').primaryKey(),
  userId: integer('user_id').references(() => Users.userId),
  preferenceType: text('preference_type'),
  value: text('value'),
})
