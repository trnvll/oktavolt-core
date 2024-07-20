CREATE TABLE IF NOT EXISTS "communication_embeddings" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"communication_id" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preference_embeddings" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"preference_id" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "relationship_embeddings" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"relationship_id" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication_embeddings" ADD CONSTRAINT "communication_embeddings_communication_id_communications_comm_id_fk" FOREIGN KEY ("communication_id") REFERENCES "public"."communications"("comm_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preference_embeddings" ADD CONSTRAINT "preference_embeddings_preference_id_preferences_pref_id_fk" FOREIGN KEY ("preference_id") REFERENCES "public"."preferences"("pref_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relationship_embeddings" ADD CONSTRAINT "relationship_embeddings_relationship_id_relationships_relationship_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."relationships"("relationship_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "commEmbeddingIndex" ON "communication_embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prefEmbeddingIndex" ON "preference_embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "relationEmbeddingIndex" ON "relationship_embeddings" USING hnsw ("embedding" vector_cosine_ops);