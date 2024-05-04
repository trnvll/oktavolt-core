import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from './user'
import { Relationships } from './relationship'

export const FinancialTransactions = pgTable('financial_transactions', {
  transId: serial('trans_id').primaryKey(),
  userId: integer('user_id').references(() => Users.userId),
  relationshipID: integer('relationship_id').references(
    () => Relationships.relationshipId,
  ),
  amount: text('amount'),
  type: text('type'),
  timestamp: timestamp('timestamp'),
  description: text('description'),
})
