import { serial, text, timestamp, pgTable, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'

export const Users = pgTable('users', {
  ...timestamps,
  userId: serial('user_id').notNull().primaryKey(),
  authzUserId: text('authz_user_id'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: varchar('phone', { length: 15 }).notNull(),
  dob: timestamp('dob').notNull(),
  context: varchar('context'),
})
