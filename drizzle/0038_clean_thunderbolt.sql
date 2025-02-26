ALTER TABLE "injects" DROP CONSTRAINT "injects_scenario_project_id_upload_key_msel_project_id_msel_fk";
--> statement-breakpoint
ALTER TABLE "msel" DROP CONSTRAINT "msel_msel_project_id_pk";--> statement-breakpoint
ALTER TABLE "msel" ADD PRIMARY KEY ("msel");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_upload_key_msel_msel_fk" FOREIGN KEY ("upload_key") REFERENCES "public"."msel"("msel") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
