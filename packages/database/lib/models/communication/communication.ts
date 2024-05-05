import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user'
import { Relationships } from '@/models/relationship/relationship'

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
  commId: serial('comm_id').primaryKey(),
  relationshipId: integer('relationship_id').references(
    () => Relationships.relationshipId,
  ),
  userId: integer('user_id').references(() => Users.userId),
  type: text('type').$type<CommunicationTypeEnum>(),
  content: text('content'),
  timestamp: timestamp('timestamp'),
  sender: text('sender'),
  receiver: text('receiver'),
  provider: text('provider').$type<CommunicationProviderEnum>(),
})
