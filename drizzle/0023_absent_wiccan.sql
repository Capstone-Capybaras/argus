ALTER TABLE "scenarios" DROP CONSTRAINT "scenarios_scenario_number_unique";--> statement-breakpoint
ALTER TABLE "scenarios" DROP CONSTRAINT "scenarios_entity_id_entities_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'scenarios'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "scenarios" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_scenario_number_project_id_pk" PRIMARY KEY("scenario_number","project_id");--> statement-breakpoint
ALTER TABLE "scenarios" DROP COLUMN IF EXISTS "entity_id";