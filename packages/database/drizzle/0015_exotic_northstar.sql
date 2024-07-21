CREATE TABLE IF NOT EXISTS "embeddings" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"user_id" integer,
	"comm_id" integer,
	"pref_id" integer,
	"relation_id" integer,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_comm_id_communications_comm_id_fk" FOREIGN KEY ("comm_id") REFERENCES "public"."communications"("comm_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_pref_id_preferences_pref_id_fk" FOREIGN KEY ("pref_id") REFERENCES "public"."preferences"("pref_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_relation_id_relationships_relationship_id_fk" FOREIGN KEY ("relation_id") REFERENCES "public"."relationships"("relationship_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_embeddings" ON "embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_user_id" ON "embeddings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_comm_id" ON "embeddings" USING btree ("comm_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_pref_id" ON "embeddings" USING btree ("pref_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_relationship_id" ON "embeddings" USING btree ("relation_id");