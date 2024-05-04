CREATE TABLE IF NOT EXISTS "communications" (
	"comm_id" serial PRIMARY KEY NOT NULL,
	"relationship_id" integer,
	"user_id" integer,
	"type" text,
	"content" text,
	"timestamp" timestamp,
	"sender" text,
	"receiver" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_media" (
	"media_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"media_type" text,
	"title" text,
	"link" text,
	"artist_author" text,
	"duration" text,
	"timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_transactions" (
	"trans_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"relationship_id" integer,
	"amount" text,
	"type" text,
	"timestamp" timestamp,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preferences" (
	"pref_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"preference_type" text,
	"value" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "relationships" (
	"relationship_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text,
	"relation_type" text,
	"email" text,
	"phone" varchar(15),
	"address" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"authz_user_id" text,
	"name" text,
	"email" text,
	"phone" varchar(15),
	"dob" timestamp,
	"created_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communications" ADD CONSTRAINT "communications_relationship_id_relationships_relationship_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "relationships"("relationship_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communications" ADD CONSTRAINT "communications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "digital_media" ADD CONSTRAINT "digital_media_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_transactions" ADD CONSTRAINT "financial_transactions_relationship_id_relationships_relationship_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "relationships"("relationship_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preferences" ADD CONSTRAINT "preferences_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relationships" ADD CONSTRAINT "relationships_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
