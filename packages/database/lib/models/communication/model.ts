import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/model'
import { Relationships } from '@/models/relationship/model'
import {
  CommunicationProviderEnum,
  CommunicationTypeEnum,
} from '@/models/communication/enums'
import { timestamps } from '@/utils/timestamps'
import { varchar } from 'drizzle-orm/pg-core'

export const Communications = pgTable('communications', {
  ...timestamps,
  commId: serial('comm_id').notNull().primaryKey(),
  relationshipId: integer('relationship_id').references(
    () => Relationships.relationshipId,
  ),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId, { onDelete: 'cascade' }),
  type: text('type').notNull().$type<CommunicationTypeEnum>(),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp'),
  sender: text('sender'),
  receiver: text('receiver').notNull(),
  provider: text('provider').notNull().$type<CommunicationProviderEnum>(),
  context: varchar('context'),
})
