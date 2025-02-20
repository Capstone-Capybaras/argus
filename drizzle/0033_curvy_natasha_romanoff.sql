DROP TABLE "responses";--> statement-breakpoint
DROP TABLE "roles_to_injects";--> statement-breakpoint
ALTER TABLE "injects" DROP CONSTRAINT "injects_inject_id_unique";--> statement-breakpoint
ALTER TABLE "injects" DROP CONSTRAINT "injects_entity_id_entities_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'injects'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "injects" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "injects" ADD COLUMN "iteration" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "injects" ALTER COLUMN "artefact" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "injects" ADD CONSTRAINT "injects_scenario_project_id_scenario_number_inject_id_iteration_pk" PRIMARY KEY("scenario_project_id","scenario_number","inject_id","iteration");--> statement-breakpoint
ALTER TABLE "injects" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "injects" ADD COLUMN "time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ADD COLUMN "scenario_title" text;--> statement-breakpoint
ALTER TABLE "injects" DROP COLUMN IF EXISTS "date_time";--> statement-breakpoint
ALTER TABLE "injects" DROP COLUMN IF EXISTS "inject_sent";--> statement-breakpoint
ALTER TABLE "injects" DROP COLUMN IF EXISTS "entity_id";