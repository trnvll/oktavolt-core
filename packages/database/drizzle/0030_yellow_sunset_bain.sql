ALTER TABLE "resources" DROP COLUMN "resource_id";
ALTER TABLE "resources" ADD COLUMN "resource_id" SERIAL PRIMARY KEY NOT NULL;