import { integer, jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { timestamps } from '@/utils/timestamps'
import { index, vector } from 'drizzle-orm/pg-core'
import { ConversationTypeEnum, Users } from '@/models'

export const Resources = pgTable(
  'resources',
  {
    ...timestamps,
    resourceId: serial('resource_id').notNull().primaryKey(),
    userId: integer('user_id').references(() => Users.userId, {
      onDelete: 'cascade',
    }),
    type: text('type').notNull().$type<ConversationTypeEnum>(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    metadata: jsonb('metadata'),
  },
  (table) => ({
    embeddingIndex: index('ix_resource_embeddings').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
    userIdIndex: index('ix_resource_user_id').on(table.userId),
  }),
)
