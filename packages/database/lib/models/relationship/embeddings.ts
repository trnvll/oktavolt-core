import { index, integer, pgTable, text, vector } from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'
import { Relationships } from '@/models'

export const RelationshipEmbeddings = pgTable(
  'relationship_embeddings',
  {
    ...timestamps,
    relationshipId: integer('relationship_id')
      .notNull()
      .references(() => Relationships.relationshipId, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index('relationEmbeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
)
