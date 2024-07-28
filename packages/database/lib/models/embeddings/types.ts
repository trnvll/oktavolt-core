import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Embeddings } from '@/models/embeddings/embedding.entity'

export type SelectEmbedding = InferSelectModel<typeof Embeddings>
export type InsertEmbedding = InferInsertModel<typeof Embeddings>
