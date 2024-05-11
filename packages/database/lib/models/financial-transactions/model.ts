import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/model'
import { Relationships } from '@/models/relationship/model'
import { timestamps } from '@/utils/timestamps'
import { varchar } from 'drizzle-orm/pg-core'

export const FinancialTransactions = pgTable('financial_transactions', {
  ...timestamps,
  transId: serial('trans_id').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId),
  relationshipID: integer('relationship_id').references(
    () => Relationships.relationshipId,
  ),
  amount: text('amount').notNull(),
  type: text('type').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  description: text('description'),
  context: varchar('context'),
})
