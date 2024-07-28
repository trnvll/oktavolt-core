import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user.entity'
import { timestamps } from '@/utils/timestamps'
import { varchar } from 'drizzle-orm/pg-core'

export const Preferences = pgTable('preferences', {
  ...timestamps,
  prefId: serial('pref_id').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId, { onDelete: 'cascade' }),
  preferenceType: text('preference_type').notNull(),
  value: text('value'),
  context: varchar('context'),
})
