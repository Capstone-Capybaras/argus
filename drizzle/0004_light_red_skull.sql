CREATE TABLE IF NOT EXISTS "CII" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"users" text NOT NULL,
	"function" text NOT NULL,
	"sensitive_info" text NOT NULL,
	"category" text NOT NULL,
	"entity_id" integer NOT NULL,
	CONSTRAINT "CII_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CII_to_scenarios" (
	"CII_id" integer NOT NULL,
	"scenario_number" varchar NOT NULL,
	CONSTRAINT "CII_to_scenarios_CII_id_scenario_number_pk" PRIMARY KEY("CII_id","scenario_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"victim_sector" text NOT NULL,
	"critical_function" text NOT NULL,
	"policy_documents" varchar NOT NULL,
	CONSTRAINT "entities_id_unique" UNIQUE("id"),
	CONSTRAINT "entities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities_to_master_threat_cubes" (
	"master_threat_cube_id" integer NOT NULL,
	"entity_id" integer NOT NULL,
	CONSTRAINT "entities_to_master_threat_cubes_entity_id_master_threat_cube_id_pk" PRIMARY KEY("entity_id","master_threat_cube_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities_to_threat_cubes" (
	"entity_id" integer NOT NULL,
	"threat_cube_id" integer NOT NULL,
	"score" integer NOT NULL,
	CONSTRAINT "entities_to_threat_cubes_entity_id_threat_cube_id_pk" PRIMARY KEY("entity_id","threat_cube_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "injects" (
	"inject_id" varchar PRIMARY KEY NOT NULL,
	"scenario_number" varchar NOT NULL,
	"date_time" timestamp NOT NULL,
	"inject_sent" boolean NOT NULL,
	"inject_desc" text NOT NULL,
	"inject_type" text NOT NULL,
	"artefact" text NOT NULL,
	"entity_id" integer,
	"from" varchar NOT NULL,
	"project_id" integer NOT NULL,
	"observation" text,
	CONSTRAINT "injects_inject_id_unique" UNIQUE("inject_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "master_threat_cubes" (
	"category" text NOT NULL,
	"name" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	CONSTRAINT "master_threat_cubes_name_unique" UNIQUE("name"),
	CONSTRAINT "master_threat_cubes_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "master_threat_cubes_to_scenarios" (
	"threat_cube_id" integer NOT NULL,
	"scenario_number" varchar NOT NULL,
	CONSTRAINT "master_threat_cubes_to_scenarios_threat_cube_id_scenario_number_pk" PRIMARY KEY("threat_cube_id","scenario_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "master_threat_cubes_to_threat_actors" (
	"threat_cube_id" integer NOT NULL,
	"threat_actor_id" integer NOT NULL,
	CONSTRAINT "master_threat_cubes_to_threat_actors_threat_actor_id_threat_cube_id_pk" PRIMARY KEY("threat_actor_id","threat_cube_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participants" (
	"email" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"entity_id" integer NOT NULL,
	CONSTRAINT "participants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "participants_to_roles" (
	"participant_email" varchar,
	"role_name" varchar,
	CONSTRAINT "participants_to_roles_participant_email_role_name_pk" PRIMARY KEY("participant_email","role_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"exercise_type" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"email_header" text NOT NULL,
	"email_footer" text NOT NULL,
	CONSTRAINT "projects_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects_to_entities" (
	"project_id" integer NOT NULL,
	"entity_id" integer NOT NULL,
	CONSTRAINT "projects_to_entities_entity_id_project_id_pk" PRIMARY KEY("entity_id","project_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects_to_threat_actors" (
	"project_id" integer NOT NULL,
	"threat_actor_id" integer NOT NULL,
	CONSTRAINT "projects_to_threat_actors_project_id_threat_actor_id_pk" PRIMARY KEY("project_id","threat_actor_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "responses" (
	"inject_id" varchar NOT NULL,
	"response" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	CONSTRAINT "responses_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"name" varchar PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles_to_injects" (
	"role_name" varchar NOT NULL,
	"inject_id" varchar NOT NULL,
	CONSTRAINT "roles_to_injects_role_name_inject_id_pk" PRIMARY KEY("role_name","inject_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scenarios" (
	"scenario_number" varchar PRIMARY KEY NOT NULL,
	"asset" varchar NOT NULL,
	"additional_context" text NOT NULL,
	"threat_actor_id" integer NOT NULL,
	"threat_actor_motivation" text NOT NULL,
	"entity_id" integer NOT NULL,
	"intended_system_impact" text NOT NULL,
	"intended_biz_impact" text NOT NULL,
	"attack_solution" text NOT NULL,
	"severity_level" integer NOT NULL,
	"initial_access" text NOT NULL,
	"exploit" text NOT NULL,
	"impact" text NOT NULL,
	"project_id" integer NOT NULL,
	CONSTRAINT "scenarios_scenario_number_unique" UNIQUE("scenario_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threat_actors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"category" text NOT NULL,
	"intent" text NOT NULL,
	"rationale" text NOT NULL,
	"capabilities" text NOT NULL,
	CONSTRAINT "threat_actors_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CII" ADD CONSTRAINT "CII_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CII_to_scenarios" ADD CONSTRAINT "CII_to_scenarios_CII_id_CII_id_fk" FOREIGN KEY ("CII_id") REFERENCES "public"."CII"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CII_to_scenarios" ADD CONSTRAINT "CII_to_scenarios_scenario_number_scenarios_scenario_number_fk" FOREIGN KEY ("scenario_number") REFERENCES "public"."scenarios"("scenario_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_master_threat_cubes" ADD CONSTRAINT "entities_to_master_threat_cubes_master_threat_cube_id_master_threat_cubes_id_fk" FOREIGN KEY ("master_threat_cube_id") REFERENCES "public"."master_threat_cubes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_master_threat_cubes" ADD CONSTRAINT "entities_to_master_threat_cubes_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_threat_cube_id_master_threat_cubes_id_fk" FOREIGN KEY ("threat_cube_id") REFERENCES "public"."master_threat_cubes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_scenario_number_scenarios_scenario_number_fk" FOREIGN KEY ("scenario_number") REFERENCES "public"."scenarios"("scenario_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "master_threat_cubes_to_scenarios" ADD CONSTRAINT "master_threat_cubes_to_scenarios_threat_cube_id_master_threat_cubes_id_fk" FOREIGN KEY ("threat_cube_id") REFERENCES "public"."master_threat_cubes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "master_threat_cubes_to_scenarios" ADD CONSTRAINT "master_threat_cubes_to_scenarios_scenario_number_scenarios_scenario_number_fk" FOREIGN KEY ("scenario_number") REFERENCES "public"."scenarios"("scenario_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "master_threat_cubes_to_threat_actors" ADD CONSTRAINT "master_threat_cubes_to_threat_actors_threat_cube_id_master_threat_cubes_id_fk" FOREIGN KEY ("threat_cube_id") REFERENCES "public"."master_threat_cubes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "master_threat_cubes_to_threat_actors" ADD CONSTRAINT "master_threat_cubes_to_threat_actors_threat_actor_id_threat_actors_id_fk" FOREIGN KEY ("threat_actor_id") REFERENCES "public"."threat_actors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participants" ADD CONSTRAINT "participants_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participants_to_roles" ADD CONSTRAINT "participants_to_roles_participant_email_participants_email_fk" FOREIGN KEY ("participant_email") REFERENCES "public"."participants"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participants_to_roles" ADD CONSTRAINT "participants_to_roles_role_name_roles_name_fk" FOREIGN KEY ("role_name") REFERENCES "public"."roles"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_to_entities" ADD CONSTRAINT "projects_to_entities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_to_entities" ADD CONSTRAINT "projects_to_entities_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_to_threat_actors" ADD CONSTRAINT "projects_to_threat_actors_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_to_threat_actors" ADD CONSTRAINT "projects_to_threat_actors_threat_actor_id_threat_actors_id_fk" FOREIGN KEY ("threat_actor_id") REFERENCES "public"."threat_actors"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "roles" ADD CONSTRAINT "roles_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_to_injects" ADD CONSTRAINT "roles_to_injects_role_name_roles_name_fk" FOREIGN KEY ("role_name") REFERENCES "public"."roles"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_to_injects" ADD CONSTRAINT "roles_to_injects_inject_id_injects_inject_id_fk" FOREIGN KEY ("inject_id") REFERENCES "public"."injects"("inject_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_threat_actor_id_threat_actors_id_fk" FOREIGN KEY ("threat_actor_id") REFERENCES "public"."threat_actors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;