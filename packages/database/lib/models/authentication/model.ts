import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { Users } from '@/models'
import { timestamps } from '@/utils/timestamps'

export const Authentication = pgTable('authentication', {
  authId: serial('auth_id').notNull().primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => Users.userId),
  email: varchar('email'),
  hashedPassword: text('hashed_password'),
  serviceName: varchar('service_name').notNull(),
  serviceDomain: varchar('service_domain').notNull(),
  ...timestamps,
})
