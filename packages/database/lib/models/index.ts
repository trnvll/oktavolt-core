import {
  FinancialTransactions,
  SelectFinancialTransactions,
  InsertFinancialTransactions,
} from '@/models/financial-transactions/financial-transactions'
import { Users, SelectUser, InsertUser } from '@/models/user/user'
import {
  Communications,
  CommunicationProviderEnum,
  CommunicationTypeEnum,
  InsertCommunications,
  SelectCommunications,
} from '@/models/communication/communication'
import {
  DigitalMedia,
  DigitalMediaTypeEnum,
  InsertDigitalMedia,
  SelectDigitalMedia,
} from '@/models/digital-media/digital-media'
import {
  Preferences,
  SelectPreferences,
  InsertPreferences,
} from '@/models/preference/preference'
import {
  Relationships,
  InsertRelationships,
  SelectRelationships,
  RelationshipTypeEnum,
} from '@/models/relationship/relationship'

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
  RelationshipTypeEnum,
}
export type {
  SelectUser,
  InsertUser,
  InsertFinancialTransactions,
  SelectFinancialTransactions,
  SelectPreferences,
  SelectCommunications,
  InsertDigitalMedia,
  SelectDigitalMedia,
  InsertCommunications,
  InsertPreferences,
  InsertRelationships,
  SelectRelationships,
}
