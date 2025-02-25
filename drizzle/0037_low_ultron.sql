CREATE TABLE IF NOT EXISTS "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"to" text[] NOT NULL,
	"cc" text[],
	"bcc" text[],
	"subject" text NOT NULL,
	"html" text NOT NULL,
	"attachments" text[],
	"redis_job_id" varchar,
	"schedule_date_time" timestamp,
	"error_message" text,
	"status" text DEFAULT 'notScheduled',
	"observations" text,
	CONSTRAINT "emails_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
