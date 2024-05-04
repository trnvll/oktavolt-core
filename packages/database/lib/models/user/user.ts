import { serial, text, timestamp, pgTable, varchar } from 'drizzle-orm/pg-core'

export const Users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  authzUserId: text('authz_user_id'),
  name: text('name'),
  email: text('email').unique(),
  phone: varchar('phone', { length: 15 }),
  dob: timestamp('dob'),
  created_at: timestamp('created_at'),
})
