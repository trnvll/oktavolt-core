import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user'
import { Relationships } from '@/models/relationship/relationship'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export enum CommunicationTypeEnum {
  TEXT = 'TEXT',
  EMAIL = 'EMAIL',
}

export enum CommunicationProviderEnum {
  ICLOUD = 'ICLOUD',
  LINKED_IN = 'LINKED_IN',
  GMAIL = 'GMAIL',
  OUTLOOK = 'OUTLOOK',
  TEAMS = 'TEAMS',
  SLACK = 'SLACK',
  DISCORD = 'DISCORD',
  IMESSAGE = 'IMESSAGE',
}

export const Communications = pgTable('communications', {
  commId: serial('comm_id').notNull().primaryKey(),
  relationshipId: integer('relationship_id').references(
    () => Relationships.relationshipId,
  ),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId),
  type: text('type').notNull().$type<CommunicationTypeEnum>(),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp'),
  sender: text('sender'),
  receiver: text('receiver').notNull(),
  provider: text('provider').notNull().$type<CommunicationProviderEnum>(),
})

export type SelectCommunications = InferSelectModel<typeof Communications>
export type InsertCommunications = InferInsertModel<typeof Communications>
