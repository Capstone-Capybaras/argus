CREATE TABLE IF NOT EXISTS "injects" (
	"inject_id" varchar PRIMARY KEY NOT NULL,
	"scenario_number" varchar NOT NULL,
	"scenario_project_id" integer NOT NULL,
	"date_time" timestamp NOT NULL,
	"inject_sent" boolean NOT NULL,
	"inject_desc" text NOT NULL,
	"inject_type" text NOT NULL,
	"artefact" text NOT NULL,
	"entity_id" integer NOT NULL,
	"from" varchar NOT NULL,
	"to_recipient" varchar NOT NULL,
	CONSTRAINT "injects_inject_id_unique" UNIQUE("inject_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk" FOREIGN KEY ("scenario_number","scenario_project_id") REFERENCES "public"."scenarios"("scenario_number","project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
