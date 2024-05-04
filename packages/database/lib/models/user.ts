import { serial, text, timestamp, pgTable } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: serial('id'),
  name: text('name'),
  email: text('email'),
  password: text('password'),
  authzUserId: text('authz_user_id'),
  role: text('role').$type<'admin' | 'customer'>(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})
