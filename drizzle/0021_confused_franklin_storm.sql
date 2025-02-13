CREATE TABLE IF NOT EXISTS "ttp_used" (
	"id" serial PRIMARY KEY NOT NULL,
	"scenario_project_id" integer NOT NULL,
	"scenario_number" varchar NOT NULL,
	"tactic" text NOT NULL,
	"technique" text,
	"notes" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ttp_used" ADD CONSTRAINT "ttp_used_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk" FOREIGN KEY ("scenario_number","scenario_project_id") REFERENCES "public"."scenarios"("scenario_number","project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
