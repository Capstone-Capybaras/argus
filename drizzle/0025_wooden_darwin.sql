CREATE TABLE IF NOT EXISTS "msel" (
	"project_id" integer NOT NULL,
	"msel" text NOT NULL,
	"date_uploaded" timestamp NOT NULL,
	CONSTRAINT "msel_msel_project_id_pk" PRIMARY KEY("msel","project_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msel" ADD CONSTRAINT "msel_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
