import { integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'
import { index, vector } from 'drizzle-orm/pg-core'
import { Chats, Users } from '@/models'

export const Embeddings = pgTable(
  'embeddings',
  {
    ...timestamps,
    userId: integer('user_id').references(() => Users.userId, {
      onDelete: 'cascade',
    }),
    chatId: integer('chat_id').references(() => Chats.chatId, {
      onDelete: 'cascade',
    }),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    metadata: jsonb('metadata'),
  },
  (table) => ({
    embeddingIndex: index('ix_embeddings').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
    userIdIndex: index('ix_user_id').on(table.userId),
    chatIdIndex: index('ix_chat_id').on(table.chatId),
  }),
)
