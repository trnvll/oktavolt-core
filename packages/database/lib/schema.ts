import {
  Authentication,
  Communications,
  CommunicationEmbeddings,
  DigitalMedia,
  FinancialTransactions,
  Preferences,
  PreferenceEmbeddings,
  Relationships,
  RelationshipEmbeddings,
  UserEmbeddings,
  Users,
  Embeddings,
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
  commEmbeddings: CommunicationEmbeddings,
  prefEmbeddings: PreferenceEmbeddings,
  relationEmbeddings: RelationshipEmbeddings,
  embeddings: Embeddings,
}
