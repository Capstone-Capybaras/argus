CREATE TYPE "public"."exercise_type" AS ENUM('executive', 'sectorial');--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "exercise_type" SET DATA TYPE exercise_type USING exercise_type::exercise_type;

CREATE TABLE IF NOT EXISTS "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"to" text[] NOT NULL,
	"subject" text NOT NULL,
	"html" text NOT NULL,
	"attachments" text[],
	"jobId" integer,
	"scheduleDateTime" timestamp,
	"errorMessage" text,
	"status" text DEFAULT 'notScheduled',
	CONSTRAINT "emails_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
