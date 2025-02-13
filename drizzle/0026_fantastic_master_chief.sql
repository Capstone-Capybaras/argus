ALTER TABLE "ttp_used" RENAME COLUMN "project_id" TO "scenario_project_id";--> statement-breakpoint
ALTER TABLE "ttp_used" DROP CONSTRAINT "ttp_used_scenario_number_unique";--> statement-breakpoint
ALTER TABLE "assets_to_scenarios" DROP CONSTRAINT "assets_to_scenarios_scenario_number_scenarios_scenario_number_fk";
--> statement-breakpoint
ALTER TABLE "ttp_used" DROP CONSTRAINT "ttp_used_scenario_number_scenarios_scenario_number_fk";
--> statement-breakpoint
ALTER TABLE "assets_to_scenarios" DROP CONSTRAINT "assets_to_scenarios_asset_id_scenario_number_pk";--> statement-breakpoint
ALTER TABLE "ttp_used" DROP CONSTRAINT "ttp_used_project_id_scenario_number_pk";--> statement-breakpoint
ALTER TABLE "ttp_used" ALTER COLUMN "scenario_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "assets_to_scenarios" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "assets_to_scenarios" ADD COLUMN "scenario_project_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ttp_used" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets_to_scenarios" ADD CONSTRAINT "assets_to_scenarios_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk" FOREIGN KEY ("scenario_number","scenario_project_id") REFERENCES "public"."scenarios"("scenario_number","project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ttp_used" ADD CONSTRAINT "ttp_used_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk" FOREIGN KEY ("scenario_number","scenario_project_id") REFERENCES "public"."scenarios"("scenario_number","project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "assets_to_scenarios" ADD CONSTRAINT "assets_to_scenarios_id_unique" UNIQUE("id");