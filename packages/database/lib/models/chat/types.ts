import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  Chats,
  ChatsToToolExecs,
  Conversations,
} from '@/models/chat/chat.entity'

export type SelectChat = InferSelectModel<typeof Chats>
export type InsertChat = InferInsertModel<typeof Chats>

export type SelectChatsToToolExecs = InferSelectModel<typeof ChatsToToolExecs>
export type InsertChatsToToolExecs = InferInsertModel<typeof ChatsToToolExecs>

export type SelectConversation = InferSelectModel<typeof Conversations>
export type InsertConversation = InferInsertModel<typeof Conversations>
