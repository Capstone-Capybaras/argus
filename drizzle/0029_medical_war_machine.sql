CREATE TYPE "public"."job_status" AS ENUM('pending', 'failed', 'done');--> statement-breakpoint
CREATE TYPE "public"."job_types" AS ENUM('scenario', 'msel', 'threat');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "job_types" NOT NULL,
	"status" "job_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scenarios_generated" (
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
	"generation_inputs" json,
	CONSTRAINT "scenarios_generated_scenario_number_project_id_pk" PRIMARY KEY("scenario_number","project_id")
);
--> statement-breakpoint
ALTER TABLE "master_threat_cubes" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios_generated" ADD CONSTRAINT "scenarios_generated_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios_generated" ADD CONSTRAINT "scenarios_generated_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
