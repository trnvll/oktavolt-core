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
import {
  Authentication,
  InsertAuthentication,
  SelectAuthentication,
} from '@/models/authentication/authentication'

const schema = {
  users: Users,
  comms: Communications,
  digitalmedia: DigitalMedia,
  fintxs: FinancialTransactions,
  prefs: Preferences,
  relations: Relationships,
  auth: Authentication,
}

export {
  schema,
  FinancialTransactions as FinTxs,
  Users,
  DigitalMedia,
  Preferences,
  Relationships,
  Communications,
  Authentication,
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
  InsertAuthentication,
  SelectAuthentication,
}
