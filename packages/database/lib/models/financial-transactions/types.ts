import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { FinancialTransactions } from '@/models/financial-transactions/model'

export type SelectFinancialTransactions = InferSelectModel<
  typeof FinancialTransactions
>
export type InsertFinancialTransactions = InferInsertModel<
  typeof FinancialTransactions
>
