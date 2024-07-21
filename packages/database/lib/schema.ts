import {
  Communications,
  Preferences,
  PreferenceEmbeddings,
  Relationships,
  RelationshipEmbeddings,
  Users,
  Embeddings,
} from '@/models'

export const schema = {
  users: Users,
  comms: Communications,
  prefs: Preferences,
  relations: Relationships,
  prefEmbeddings: PreferenceEmbeddings,
  relationEmbeddings: RelationshipEmbeddings,
  embeddings: Embeddings,
}
