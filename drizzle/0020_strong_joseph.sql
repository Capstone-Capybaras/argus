CREATE TABLE IF NOT EXISTS "assets_to_scenarios" (
	"asset_id" integer NOT NULL,
	"scenario_number" varchar NOT NULL,
	CONSTRAINT "assets_to_scenarios_asset_id_scenario_number_pk" PRIMARY KEY("asset_id","scenario_number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets_to_scenarios" ADD CONSTRAINT "assets_to_scenarios_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets_to_scenarios" ADD CONSTRAINT "assets_to_scenarios_scenario_number_scenarios_scenario_number_fk" FOREIGN KEY ("scenario_number") REFERENCES "public"."scenarios"("scenario_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
