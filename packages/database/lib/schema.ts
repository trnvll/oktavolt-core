import {
  Communications,
  Preferences,
  Relationships,
  Users,
  Embeddings,
  Chats,
  ToolExecs,
  ChatsToToolExecs,
  Conversations,
  Resources,
} from '@/models'

export const schema = {
  users: Users,
  comms: Communications,
  prefs: Preferences,
  relations: Relationships,
  embeddings: Embeddings,
  chats: Chats,
  toolExecs: ToolExecs,
  chatsToToolExecs: ChatsToToolExecs,
  convs: Conversations,
  resources: Resources,
}
