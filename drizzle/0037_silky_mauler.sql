ALTER TABLE "injects" ADD COLUMN "upload_key" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_scenario_project_id_upload_key_msel_project_id_msel_fk" FOREIGN KEY ("scenario_project_id","upload_key") REFERENCES "public"."msel"("project_id","msel") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
