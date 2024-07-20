import { index, integer, pgTable, text, vector } from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'
import { Communications } from '@/models'

export const CommunicationEmbeddings = pgTable(
  'communication_embeddings',
  {
    ...timestamps,
    commId: integer('communication_id')
      .notNull()
      .references(() => Communications.commId, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index('commEmbeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
)
