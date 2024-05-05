ALTER TABLE "communications" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "communications" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "communications" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "communications" ALTER COLUMN "receiver" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "communications" ALTER COLUMN "provider" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_media" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_media" ALTER COLUMN "media_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_media" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "financial_transactions" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "financial_transactions" ALTER COLUMN "amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "financial_transactions" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "financial_transactions" ALTER COLUMN "timestamp" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "preferences" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "preferences" ALTER COLUMN "preference_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "relationships" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "relationships" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "relationships" ALTER COLUMN "relation_type" SET NOT NULL;