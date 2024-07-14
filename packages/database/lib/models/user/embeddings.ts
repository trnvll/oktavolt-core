import { index, pgTable, text, vector, integer } from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'
import { Users } from '@/models'

export const UserEmbeddings = pgTable(
  'user_embeddings',
  {
    ...timestamps,
    userId: integer('user_id')
      .notNull()
      .references(() => Users.userId, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
)
