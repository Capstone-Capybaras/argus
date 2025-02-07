ALTER TABLE "emails" RENAME COLUMN "jobId" TO "job_id";--> statement-breakpoint
ALTER TABLE "emails" RENAME COLUMN "scheduleDateTime" TO "schedule_date_time";--> statement-breakpoint
ALTER TABLE "emails" RENAME COLUMN "errorMessage" TO "error_message";--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "project_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "projectId";