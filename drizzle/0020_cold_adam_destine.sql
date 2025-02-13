CREATE TABLE IF NOT EXISTS "assets_to_scenarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"scenario_number" varchar NOT NULL,
	"scenario_project_id" integer NOT NULL,
	CONSTRAINT "assets_to_scenarios_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scenarios" (
	"scenario_number" varchar NOT NULL,
	"additional_context" text NOT NULL,
	"threat_actor_motivation" text NOT NULL,
	"intended_system_impact" text NOT NULL,
	"intended_biz_impact" text NOT NULL,
	"attack_sophistication" text NOT NULL,
	"severity_level" integer NOT NULL,
	"initial_access" text NOT NULL,
	"exploit" text NOT NULL,
	"impact" text NOT NULL,
	"project_id" integer NOT NULL,
	"asset_id" integer NOT NULL,
	CONSTRAINT "scenarios_scenario_number_project_id_pk" PRIMARY KEY("scenario_number","project_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets_to_scenarios" ADD CONSTRAINT "assets_to_scenarios_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets_to_scenarios" ADD CONSTRAINT "assets_to_scenarios_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk" FOREIGN KEY ("scenario_number","scenario_project_id") REFERENCES "public"."scenarios"("scenario_number","project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
