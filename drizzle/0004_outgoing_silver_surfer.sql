CREATE TABLE IF NOT EXISTS "CII" (
	"name" varchar NOT NULL,
	"users" text NOT NULL,
	"function" text NOT NULL,
	"sensitive_info" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity" (
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"victim_sector" text NOT NULL,
	"CII" varchar NOT NULL,
	"critical_function" text NOT NULL,
	"policy_documents" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "injects" (
	"scenario_number" varchar NOT NULL,
	"date_time" timestamp NOT NULL,
	"inject_sent" boolean NOT NULL,
	"inject_desc" text NOT NULL,
	"inject_type" text NOT NULL,
	"artefact" text NOT NULL,
	"entity" varchar NOT NULL,
	"from" varchar NOT NULL,
	"to_recipient" varchar NOT NULL,
	"project" varchar NOT NULL,
	"inject_id" varchar PRIMARY KEY NOT NULL,
	"observation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "master_threat_landscape" (
	"category" text NOT NULL,
	"name" text NOT NULL,
	"pillar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participants" (
	"email" varchar PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"name" text NOT NULL,
	"exercise_type" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"email_header" text NOT NULL,
	"email_footer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "responses" (
	"inject_id" varchar NOT NULL,
	"response" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role" (
	"name" varchar NOT NULL,
	"project" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scenarios" (
	"scenario_number" varchar PRIMARY KEY NOT NULL,
	"threat_actor" varchar NOT NULL,
	"threat_actor_motivation" text NOT NULL,
	"entity" varchar NOT NULL,
	"CII" varchar NOT NULL,
	"intended_system_impact" text NOT NULL,
	"intended_biz_impact" text NOT NULL,
	"attack_solution" text NOT NULL,
	"severity_level" integer NOT NULL,
	"initial_access" text NOT NULL,
	"exploit" text NOT NULL,
	"impact" text NOT NULL,
	"tactics_techniques" text NOT NULL,
	"project" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threat_actor" (
	"name" varchar NOT NULL,
	"threat_landscape" text NOT NULL,
	"category" text NOT NULL,
	"intent" text NOT NULL,
	"rationale" text NOT NULL,
	"capabilities" text NOT NULL,
	"project" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_scenario_number_scenarios_scenario_number_fk" FOREIGN KEY ("scenario_number") REFERENCES "public"."scenarios"("scenario_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_entity_entity_name_fk" FOREIGN KEY ("entity") REFERENCES "public"."entity"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_project_project_name_fk" FOREIGN KEY ("project") REFERENCES "public"."project"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_inject_id_injects_inject_id_fk" FOREIGN KEY ("inject_id") REFERENCES "public"."injects"("inject_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role" ADD CONSTRAINT "role_project_project_name_fk" FOREIGN KEY ("project") REFERENCES "public"."project"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_threat_actor_threat_actor_name_fk" FOREIGN KEY ("threat_actor") REFERENCES "public"."threat_actor"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_entity_entity_name_fk" FOREIGN KEY ("entity") REFERENCES "public"."entity"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_CII_CII_name_fk" FOREIGN KEY ("CII") REFERENCES "public"."CII"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_project_project_name_fk" FOREIGN KEY ("project") REFERENCES "public"."project"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_actor" ADD CONSTRAINT "threat_actor_project_project_name_fk" FOREIGN KEY ("project") REFERENCES "public"."project"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
