import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user.entity'
import { RelationshipTypeEnum } from '@/models/relationship/enums'
import { timestamps } from '@/utils/timestamps'

export const Relationships = pgTable('relationships', {
  ...timestamps,
  relationshipId: serial('relationship_id').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  relationType: text('relation_type').notNull().$type<RelationshipTypeEnum>(),
  email: text('email'),
  phone: varchar('phone', { length: 15 }),
  address: text('address'),
  notes: text('notes'),
  context: varchar('context'),
})
