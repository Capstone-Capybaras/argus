CREATE TYPE "public"."asset_category" AS ENUM('IT', 'IOT', 'OT');--> statement-breakpoint
ALTER TABLE "injects" DROP CONSTRAINT "injects_project_id_iteration_inject_id_upload_key_unique";--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "users" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "function" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "sensitive_info" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "category" SET DATA TYPE asset_category USING category::asset_category;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "injects" ADD CONSTRAINT "injects_project_id_iteration_inject_id_scenario_number_unique" UNIQUE("project_id","iteration","inject_id","scenario_number");