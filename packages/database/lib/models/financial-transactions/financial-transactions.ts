import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { Users } from '@/models/user/user'
import { Relationships } from '@/models/relationship/relationship'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const FinancialTransactions = pgTable('financial_transactions', {
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
})

export type SelectFinancialTransactions = InferSelectModel<
  typeof FinancialTransactions
>
export type InsertFinancialTransactions = InferInsertModel<
  typeof FinancialTransactions
>
