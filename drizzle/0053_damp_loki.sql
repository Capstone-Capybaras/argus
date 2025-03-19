ALTER TABLE "projects" ALTER COLUMN "email_header" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "email_footer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "client_name" text;--> statement-breakpoint
UPDATE "projects" SET "client_name" = '' WHERE "client_name" IS NULL;
ALTER TABLE "projects" ALTER COLUMN "client_name" SET NOT NULL;
ALTER TABLE "projects" ADD COLUMN "projected_exercise_dates" json;--> statement-breakpoint
ALTER TABLE "public"."projects" ALTER COLUMN "exercise_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."exercise_type";--> statement-breakpoint
UPDATE "projects" SET "exercise_type" = 'senior leader' WHERE "exercise_type"='executive';
CREATE TYPE "public"."exercise_type" AS ENUM('senior leader', 'sectorial', 'technical', 'regulatory compliance');--> statement-breakpoint
ALTER TABLE "public"."projects" ALTER COLUMN "exercise_type" SET DATA TYPE "public"."exercise_type" USING "exercise_type"::"public"."exercise_type";