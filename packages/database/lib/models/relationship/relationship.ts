import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export enum RelationshipTypeEnum {
  FRIEND = 'FRIEND',
  ROMANTIC = 'ROMANTIC',
  FWB = 'FWB',
}

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

export type SelectRelationships = InferSelectModel<typeof Relationships>
export type InsertRelationships = InferInsertModel<typeof Relationships>
