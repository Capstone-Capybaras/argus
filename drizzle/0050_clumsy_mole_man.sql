ALTER TABLE "threat_landscape" DROP CONSTRAINT "threat_landscape_file_key_threat_files_file_key_fk";
--> statement-breakpoint
ALTER TABLE "scenarios_generated" DROP CONSTRAINT "scenarios_generated_scenario_number_project_id_pk";--> statement-breakpoint
ALTER TABLE "threat_landscape_generated" DROP CONSTRAINT "threat_landscape_generated_entity_id_threat_actor_name_pk";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_landscape" ADD CONSTRAINT "threat_landscape_file_key_threat_files_file_key_fk" FOREIGN KEY ("file_key") REFERENCES "public"."threat_files"("file_key") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
