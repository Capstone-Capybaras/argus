ALTER TYPE "public"."job_types" ADD VALUE 'learning';--> statement-breakpoint
ALTER TABLE "scenarios" ADD COLUMN "save_to_learnings" boolean DEFAULT true;