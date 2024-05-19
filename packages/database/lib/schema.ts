import {
  Authentication,
  Communications,
  DigitalMedia,
  FinancialTransactions,
  Preferences,
  Relationships,
  UserEmbeddings,
  Users,
} from '@/models'

export const schema = {
  users: Users,
  comms: Communications,
  digitalmedia: DigitalMedia,
  fintxs: FinancialTransactions,
  prefs: Preferences,
  relations: Relationships,
  auth: Authentication,
  userEmbeddings: UserEmbeddings,
}
