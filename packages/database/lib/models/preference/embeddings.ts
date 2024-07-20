import { index, integer, pgTable, text, vector } from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'
import { Preferences } from '@/models'

export const PreferenceEmbeddings = pgTable(
  'preference_embeddings',
  {
    ...timestamps,
    prefId: integer('preference_id')
      .notNull()
      .references(() => Preferences.prefId, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index('prefEmbeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
)
