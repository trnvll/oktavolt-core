ALTER TABLE "authentication" DROP CONSTRAINT "authentication_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "communications" DROP CONSTRAINT "communications_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "digital_media" DROP CONSTRAINT "digital_media_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "financial_transactions" DROP CONSTRAINT "financial_transactions_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "preferences" DROP CONSTRAINT "preferences_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "relationships" DROP CONSTRAINT "relationships_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_embeddings" DROP CONSTRAINT "user_embeddings_user_id_users_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authentication" ADD CONSTRAINT "authentication_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communications" ADD CONSTRAINT "communications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_media" ADD CONSTRAINT "digital_media_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preferences" ADD CONSTRAINT "preferences_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relationships" ADD CONSTRAINT "relationships_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_embeddings" ADD CONSTRAINT "user_embeddings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
