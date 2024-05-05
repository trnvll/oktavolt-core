import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { Users } from '@/models'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const Authentication = pgTable('authentication', {
  authId: serial('auth_id').notNull().primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => Users.userId),
  email: varchar('email'),
  hashedPassword: text('hashed_password'),
  serviceName: varchar('service_name').notNull(),
  serviceDomain: varchar('service_domain').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})

export type SelectAuthentication = InferSelectModel<typeof Authentication>
export type InsertAuthentication = InferInsertModel<typeof Authentication>
