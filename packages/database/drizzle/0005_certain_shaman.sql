CREATE TABLE IF NOT EXISTS "authentication" (
	"auth_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"email" varchar,
	"hashed_password" text,
	"service_name" varchar NOT NULL,
	"service_domain" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authentication" ADD CONSTRAINT "authentication_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
