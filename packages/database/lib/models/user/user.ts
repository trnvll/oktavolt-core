import { serial, text, timestamp, pgTable, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const Users = pgTable('users', {
  userId: serial('user_id').notNull().primaryKey(),
  authzUserId: text('authz_user_id'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: varchar('phone', { length: 15 }).notNull(),
  dob: timestamp('dob').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type SelectUser = InferSelectModel<typeof Users>
export type InsertUser = InferInsertModel<typeof Users>
