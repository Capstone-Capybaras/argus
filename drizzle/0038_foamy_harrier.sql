ALTER TABLE "injects" RENAME COLUMN "uploade_key" TO "upload_key";--> statement-breakpoint
ALTER TABLE "injects" DROP CONSTRAINT "injects_scenario_number_scenario_project_id_uploade_key_scenarios_scenario_number_project_id_msel_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_scenario_number_scenario_project_id_upload_key_scenarios_scenario_number_project_id_msel_fk" FOREIGN KEY ("scenario_number","scenario_project_id","upload_key") REFERENCES "public"."scenarios"("scenario_number","project_id","msel") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
