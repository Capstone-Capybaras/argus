ALTER TABLE "threat_actors" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "injects" ADD COLUMN "to_recipient" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios" ADD COLUMN "CII" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios" ADD COLUMN "tactics_techniques" text NOT NULL;--> statement-breakpoint
ALTER TABLE "threat_actors" ADD COLUMN "project_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_CII_CII_id_fk" FOREIGN KEY ("CII") REFERENCES "public"."CII"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_tactics_techniques_master_threat_cubes_name_fk" FOREIGN KEY ("tactics_techniques") REFERENCES "public"."master_threat_cubes"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_actors" ADD CONSTRAINT "threat_actors_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
