ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_comm_id_communications_comm_id_fk";
--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_pref_id_preferences_pref_id_fk";
--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_relation_id_relationships_relationship_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "ix_comm_id";--> statement-breakpoint
DROP INDEX IF EXISTS "ix_pref_id";--> statement-breakpoint
DROP INDEX IF EXISTS "ix_relationship_id";--> statement-breakpoint
ALTER TABLE "embeddings" DROP COLUMN IF EXISTS "comm_id";--> statement-breakpoint
ALTER TABLE "embeddings" DROP COLUMN IF EXISTS "pref_id";--> statement-breakpoint
ALTER TABLE "embeddings" DROP COLUMN IF EXISTS "relation_id";--> statement-breakpoint
DROP TABLE "communications";--> statement-breakpoint
DROP TABLE "preferences";--> statement-breakpoint
DROP TABLE "relationships";
