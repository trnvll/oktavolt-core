import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user'

export const Relationships = pgTable('relationships', {
  relationshipId: serial('relationship_id').primaryKey(),
  userId: integer('user_id').references(() => Users.userId),
  name: text('name'),
  relationType: text('relation_type'),
  email: text('email'),
  phone: varchar('phone', { length: 15 }),
  address: text('address'),
  notes: text('notes'),
})
