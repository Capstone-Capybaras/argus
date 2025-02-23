ALTER TABLE "emails" RENAME COLUMN "job_id" TO "redis_job_id";--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "redis_job_id" SET DATA TYPE varchar;