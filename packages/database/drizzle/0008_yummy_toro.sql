CREATE EXTENSION IF NOT EXISTS "vector";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_embeddings" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"user_id" integer NOT NULL,
	"combined_text" text NOT NULL,
	"embedding" vector(384) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_embeddings" ADD CONSTRAINT "user_embeddings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
