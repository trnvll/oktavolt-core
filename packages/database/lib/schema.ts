import {
  Authentication,
  Communications,
  DigitalMedia,
  FinancialTransactions,
  Preferences,
  Relationships,
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
}
