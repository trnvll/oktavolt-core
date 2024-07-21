ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_comm_id_communications_comm_id_fk";
--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_pref_id_preferences_pref_id_fk";
--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_relation_id_relationships_relationship_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_comm_id_communications_comm_id_fk" FOREIGN KEY ("comm_id") REFERENCES "public"."communications"("comm_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_pref_id_preferences_pref_id_fk" FOREIGN KEY ("pref_id") REFERENCES "public"."preferences"("pref_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_relation_id_relationships_relationship_id_fk" FOREIGN KEY ("relation_id") REFERENCES "public"."relationships"("relationship_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
