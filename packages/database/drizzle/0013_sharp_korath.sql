CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "user_embeddings" USING hnsw ("embedding" vector_cosine_ops);