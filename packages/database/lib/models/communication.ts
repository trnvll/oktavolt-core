import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Relationships } from './relationship'
import { Users } from './user'

export const Communications = pgTable('communications', {
  commId: serial('comm_id').primaryKey(),
  relationshipId: integer('relationship_id').references(
    () => Relationships.relationshipId,
  ),
  userId: integer('user_id').references(() => Users.userId),
  type: text('type'),
  content: text('content'),
  timestamp: timestamp('timestamp'),
  sender: text('sender'),
  receiver: text('receiver'),
})
