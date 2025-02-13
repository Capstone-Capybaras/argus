CREATE TABLE IF NOT EXISTS "entities_to_participants" (
	"participant_email" varchar NOT NULL,
	"entity_id" integer NOT NULL,
	CONSTRAINT "entities_to_participants_participant_email_entity_id_pk" PRIMARY KEY("participant_email","entity_id")
);
--> statement-breakpoint
DROP TABLE "CII_to_scenarios";--> statement-breakpoint
DROP TABLE "responses";--> statement-breakpoint
DROP TABLE "roles_to_injects";--> statement-breakpoint
DROP TABLE "injects";--> statement-breakpoint
DROP TABLE "projects_to_threat_cubes";--> statement-breakpoint
DROP TABLE "ttp_used";--> statement-breakpoint
DROP TABLE "scenarios";--> statement-breakpoint
ALTER TABLE "CII" RENAME TO "assets";--> statement-breakpoint
ALTER TABLE "assets" DROP CONSTRAINT "CII_id_unique";--> statement-breakpoint
ALTER TABLE "participants_to_roles" DROP CONSTRAINT "participants_to_roles_role_name_roles_name_fk";
--> statement-breakpoint
ALTER TABLE "roles" DROP CONSTRAINT "roles_name_unique";--> statement-breakpoint
ALTER TABLE "assets" DROP CONSTRAINT "CII_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "roles" DROP CONSTRAINT "roles_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "threat_landscape" DROP CONSTRAINT "threat_landscape_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_entity_id_threat_cube_id_project_id_pk";--> statement-breakpoint
ALTER TABLE "participants_to_roles" DROP CONSTRAINT "participants_to_roles_participant_email_role_name_pk";--> statement-breakpoint
ALTER TABLE "threat_landscape" DROP CONSTRAINT "threat_landscape_project_id_entity_id_threat_actor_name_pk";--> statement-breakpoint
ALTER TABLE "master_threat_cubes" ALTER COLUMN "tactic" SET NOT NULL;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'roles'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "roles" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "entity_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "threat_landscape" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_entity_id_threat_cube_id_pk" PRIMARY KEY("entity_id","threat_cube_id");--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_name_entity_id_pk" PRIMARY KEY("name","entity_id");--> statement-breakpoint
ALTER TABLE "threat_landscape" ADD CONSTRAINT "threat_landscape_entity_id_threat_actor_name_pk" PRIMARY KEY("entity_id","threat_actor_name");--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "bcc" text[];--> statement-breakpoint
ALTER TABLE "participants_to_roles" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "participants_to_roles" ADD COLUMN "role_entity_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_participants" ADD CONSTRAINT "entities_to_participants_participant_email_participants_email_fk" FOREIGN KEY ("participant_email") REFERENCES "public"."participants"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_participants" ADD CONSTRAINT "entities_to_participants_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets" ADD CONSTRAINT "assets_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_threat_cube_id_master_threat_cubes_thread_cube_id_fk" FOREIGN KEY ("threat_cube_id") REFERENCES "public"."master_threat_cubes"("thread_cube_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participants_to_roles" ADD CONSTRAINT "participants_to_roles_role_name_role_entity_id_roles_name_entity_id_fk" FOREIGN KEY ("role_name","role_entity_id") REFERENCES "public"."roles"("name","entity_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP COLUMN IF EXISTS "project_id";--> statement-breakpoint
ALTER TABLE "roles" DROP COLUMN IF EXISTS "project_id";--> statement-breakpoint
ALTER TABLE "threat_landscape" DROP COLUMN IF EXISTS "project_id";--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "participants_to_roles" ADD CONSTRAINT "participants_to_roles_id_unique" UNIQUE("id");