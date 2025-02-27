CREATE TABLE IF NOT EXISTS "injects_generated" (
	"id" serial PRIMARY KEY NOT NULL,
	"inject_id" varchar,
	"scenario_number" varchar,
	"project_id" integer NOT NULL,
	"date" date,
	"time" time,
	"inject_desc" text,
	"inject_type" text,
	"artefact" text,
	"from" varchar,
	"to_recipient" varchar,
	"iteration" integer NOT NULL,
	"upload_key" varchar,
	"generation_inputs" json NOT NULL,
	CONSTRAINT "injects_generated_project_id_iteration_inject_id_iteration_pk" PRIMARY KEY("project_id","iteration","inject_id","iteration"),
	CONSTRAINT "injects_generated_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects_generated" ADD CONSTRAINT "injects_generated_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
