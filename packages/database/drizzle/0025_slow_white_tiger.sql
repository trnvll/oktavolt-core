CREATE TABLE IF NOT EXISTS "chats_to_tool_executions" (
	"chat_id" integer NOT NULL,
	"tool_exec_id" integer NOT NULL,
	CONSTRAINT "chats_to_tool_executions_chat_id_tool_exec_id_pk" PRIMARY KEY("chat_id","tool_exec_id")
);
--> statement-breakpoint
ALTER TABLE "tool_executions" DROP CONSTRAINT "tool_executions_chat_id_chats_chat_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats_to_tool_executions" ADD CONSTRAINT "chats_to_tool_executions_chat_id_chats_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("chat_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chats_to_tool_executions" ADD CONSTRAINT "chats_to_tool_executions_tool_exec_id_tool_executions_tool_exec_id_fk" FOREIGN KEY ("tool_exec_id") REFERENCES "public"."tool_executions"("tool_exec_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tool_executions" DROP COLUMN IF EXISTS "chat_id";