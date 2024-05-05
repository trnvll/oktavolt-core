import { FinancialTransactions } from '@/models/financial-transactions/financial-transactions'
import { Users, SelectUser, InsertUser } from '@/models/user/user'
import {
  Communications,
  CommunicationProviderEnum,
  CommunicationTypeEnum,
} from '@/models/communication/communication'
import {
  DigitalMedia,
  DigitalMediaTypeEnum,
} from '@/models/digital-media/digital-media'
import { Preferences } from '@/models/preference/preference'
import { Relationships } from '@/models/relationship/relationship'

const schema = {
  Users,
  Communications,
  DigitalMedia,
  FinTxs: FinancialTransactions,
  Preferences,
  Relationships,
}

export {
  schema,
  FinancialTransactions as FinTxs,
  Users,
  DigitalMedia,
  Preferences,
  Relationships,
  Communications,
  DigitalMediaTypeEnum,
  CommunicationProviderEnum,
  CommunicationTypeEnum,
}
export type { SelectUser, InsertUser }
