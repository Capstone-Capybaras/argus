CREATE TABLE IF NOT EXISTS "injects_to_scenarios" (
	"project_id" integer NOT NULL,
	"inject_id" integer NOT NULL,
	"scenario_number" varchar NOT NULL,
	CONSTRAINT "injects_to_scenarios_inject_id_project_id_scenario_number_unique" UNIQUE("inject_id","project_id","scenario_number")
);
--> statement-breakpoint
ALTER TABLE "injects" RENAME COLUMN "scenario_project_id" TO "project_id";--> statement-breakpoint
ALTER TABLE "injects" DROP CONSTRAINT "injects_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk";
--> statement-breakpoint
ALTER TABLE "injects" DROP CONSTRAINT "injects_scenario_project_id_scenario_number_inject_id_iteration_pk";--> statement-breakpoint
ALTER TABLE "injects" ALTER COLUMN "scenario_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "injects" ALTER COLUMN "date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "injects" ALTER COLUMN "time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "injects" ALTER COLUMN "inject_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "injects" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects_to_scenarios" ADD CONSTRAINT "injects_to_scenarios_inject_id_injects_id_fk" FOREIGN KEY ("inject_id") REFERENCES "public"."injects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects_to_scenarios" ADD CONSTRAINT "injects_to_scenarios_scenario_number_project_id_scenarios_scenario_number_project_id_fk" FOREIGN KEY ("scenario_number","project_id") REFERENCES "public"."scenarios"("scenario_number","project_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "injects" ADD CONSTRAINT "injects_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "injects" ADD CONSTRAINT "injects_project_id_iteration_inject_id_upload_key_unique" UNIQUE("project_id","iteration","inject_id","upload_key");