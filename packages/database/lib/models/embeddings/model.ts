import { integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'
import { index, vector } from 'drizzle-orm/pg-core'
import { Communications, Preferences, Relationships, Users } from '@/models'

export const Embeddings = pgTable(
  'embeddings',
  {
    ...timestamps,
    userId: integer('user_id').references(() => Users.userId),
    commId: integer('comm_id').references(() => Communications.commId),
    prefId: integer('pref_id').references(() => Preferences.prefId),
    relationshipId: integer('relation_id').references(
      () => Relationships.relationshipId,
    ),
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
    commIdIndex: index('ix_comm_id').on(table.commId),
    prefIdIndex: index('ix_pref_id').on(table.prefId),
    relationshipIdIndex: index('ix_relationship_id').on(table.relationshipId),
  }),
)
