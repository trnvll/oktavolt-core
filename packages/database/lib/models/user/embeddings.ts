import { pgTable, text } from 'drizzle-orm/pg-core'
import { vector } from 'pgvector/drizzle-orm'
import { timestamps } from '@/utils/timestamps'
import { integer } from 'drizzle-orm/pg-core'
import { Users } from '@/models'

export const UserEmbeddings = pgTable('user_embeddings', {
  ...timestamps,
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId),
  combinedText: text('combined_text').notNull(),
  embedding: vector('embedding', { dimensions: 384 }).notNull(),
})
