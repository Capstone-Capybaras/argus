ALTER TABLE "assets" DROP COLUMN IF EXISTS "components";--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "components" json;--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "description" text;