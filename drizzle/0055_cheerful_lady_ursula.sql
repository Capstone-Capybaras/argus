ALTER TABLE "projects" DROP COLUMN IF EXISTS "projected_exercise_dates";
ALTER TABLE "projects" ADD COLUMN "projected_exercise_dates" date[];--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;