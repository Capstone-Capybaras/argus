DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_type') THEN
        CREATE TYPE "public"."exercise_type" AS ENUM('executive', 'sectorial');
    END IF;
END $$;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'server_type') THEN
        CREATE TYPE "public"."server_type" AS ENUM('simx1', 'simx2');
    END IF;
END $$;
CREATE TABLE IF NOT EXISTS "projects_to_threat_cubes" (
	"project_id" integer NOT NULL,
	"threat_cube_id" integer NOT NULL,
	"score" integer NOT NULL,
	CONSTRAINT "projects_to_threat_cubes_project_id_threat_cube_id_pk" PRIMARY KEY("project_id","threat_cube_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sender" (
	"project_id" integer NOT NULL,
	"server" "server_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tacticsTable" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threatLandscape" (
	"project_id" integer,
	"entity_id" integer,
	"threat_actor_name" text,
	"category" text,
	"capability" text,
	"capability_reason" text,
	"intent" text,
	"intent_reason" text,
	"opportunity" text,
	"opportunity_reason" text,
	CONSTRAINT "threatLandscape_project_id_entity_id_threat_actor_name_pk" PRIMARY KEY("project_id","entity_id","threat_actor_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ttp_used" (
	"project_id" integer NOT NULL,
	"scenario_number" varchar,
	"tactic" text NOT NULL,
	"technique" text,
	"notes" text,
	CONSTRAINT "ttp_used_project_id_scenario_number_pk" PRIMARY KEY("project_id","scenario_number"),
	CONSTRAINT "ttp_used_scenario_number_unique" UNIQUE("scenario_number")
);
--> statement-breakpoint
DROP TABLE "entities_to_master_threat_cubes";--> statement-breakpoint
DROP TABLE "master_threat_cubes_to_scenarios";--> statement-breakpoint
DROP TABLE "master_threat_cubes_to_threat_actors";--> statement-breakpoint
DROP TABLE "projects_to_threat_actors";--> statement-breakpoint
DROP TABLE "threat_actors" CASCADE; --> statement-breakpoint
ALTER TABLE "master_threat_cubes" DROP CONSTRAINT "master_threat_cubes_name_unique" CASCADE;--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_threat_cube_id_master_threat_cubes_id_fk";
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_entity_id_threat_cube_id_pk";--> statement-breakpoint
ALTER TABLE entities ALTER COLUMN policy_documents TYPE text[] USING string_to_array(policy_documents, ',');--> statement-breakpoint
ALTER TABLE "master_threat_cubes" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "exercise_type" SET DATA TYPE exercise_type;--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" ADD COLUMN "project_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_entity_id_threat_cube_id_project_id_pk" PRIMARY KEY("entity_id","threat_cube_id","project_id");--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "severity_levels" text;--> statement-breakpoint
ALTER TABLE "master_threat_cubes" ADD COLUMN "tactic" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threatLandscape" ADD CONSTRAINT "threatLandscape_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threatLandscape" ADD CONSTRAINT "threatLandscape_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ttp_used" ADD CONSTRAINT "ttp_used_scenario_number_scenarios_scenario_number_fk" FOREIGN KEY ("scenario_number") REFERENCES "public"."scenarios"("scenario_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "master_threat_cubes" ADD CONSTRAINT "master_threat_cubes_tactic_tacticsTable_id_fk" FOREIGN KEY ("tactic") REFERENCES "public"."tacticsTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "injects" DROP COLUMN IF EXISTS "observation";--> statement-breakpoint
ALTER TABLE "master_threat_cubes" DROP COLUMN IF EXISTS "category";--> statement-breakpoint
ALTER TABLE "scenarios" DROP COLUMN IF EXISTS "threat_actor_id";--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_name_unique" UNIQUE("name");