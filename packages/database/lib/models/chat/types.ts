import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Chats } from '@/models/chat/chat.entity'

export type SelectChat = InferSelectModel<typeof Chats>
export type InsertChat = InferInsertModel<typeof Chats>
