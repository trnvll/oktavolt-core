CREATE TABLE IF NOT EXISTS "tool_executions" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"tool_exec_id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"status" text NOT NULL,
	"tool_name" text NOT NULL,
	"execution_data" jsonb NOT NULL,
	"executed_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tool_executions" ADD CONSTRAINT "tool_executions_chat_id_chats_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("chat_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
