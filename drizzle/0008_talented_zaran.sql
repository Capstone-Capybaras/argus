/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'master_threat_cubes'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "master_threat_cubes" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "master_threat_cubes" ADD CONSTRAINT "master_threat_cubes_name_unique" UNIQUE("name");