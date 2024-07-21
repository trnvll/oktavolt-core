import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { Embeddings } from '@/models/embeddings/model'

export type SelectEmbedding = InferSelectModel<typeof Embeddings>
export type InsertEmbedding = InferInsertModel<typeof Embeddings>
