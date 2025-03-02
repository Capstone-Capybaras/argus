ALTER TABLE "master_threat_cubes" RENAME COLUMN "threat_cube_id" TO "id";--> statement-breakpoint
ALTER TABLE "cubes_to_tactics" DROP CONSTRAINT "cubes_to_tactics_tactic_id_tactics_id_fk";
--> statement-breakpoint
ALTER TABLE "cubes_to_tactics" DROP CONSTRAINT "cubes_to_tactics_technique_id_master_threat_cubes_threat_cube_id_fk";
--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_threat_cube_id_master_threat_cubes_threat_cube_id_fk";
--> statement-breakpoint
ALTER TABLE "cubes_to_tactics" DROP CONSTRAINT "cubes_to_tactics_tactic_id_technique_id_pk";--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_entity_id_threat_cube_id_pk";--> statement-breakpoint
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
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'tactics'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

ALTER TABLE "master_threat_cubes" DROP CONSTRAINT "master_threat_cubes_pkey"; --> statement-breakpoint
ALTER TABLE "tactics" DROP CONSTRAINT "tacticsTable_pkey"; --> statement-breakpoint

-- ALTER TABLE "tactics" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "cubes_to_tactics" ADD COLUMN "version" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" ADD COLUMN "version" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "master_threat_cubes" ADD COLUMN "version" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "tactics" ADD COLUMN "version" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "cubes_to_tactics" ADD CONSTRAINT "cubes_to_tactics_tactic_id_technique_id_version_pk" PRIMARY KEY("tactic_id","technique_id","version");--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_entity_id_threat_cube_id_version_pk" PRIMARY KEY("entity_id","threat_cube_id","version");--> statement-breakpoint
ALTER TABLE "master_threat_cubes" ADD CONSTRAINT "master_threat_cubes_id_version_pk" PRIMARY KEY("id","version");--> statement-breakpoint
ALTER TABLE "tactics" ADD CONSTRAINT "tactics_id_version_pk" PRIMARY KEY("id","version");--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "cubes_to_tactics" ADD CONSTRAINT "cubes_to_tactics_tactic_id_version_tactics_id_version_fk" FOREIGN KEY ("tactic_id","version") REFERENCES "public"."tactics"("id","version") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cubes_to_tactics" ADD CONSTRAINT "cubes_to_tactics_technique_id_version_master_threat_cubes_id_version_fk" FOREIGN KEY ("technique_id","version") REFERENCES "public"."master_threat_cubes"("id","version") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_threat_cube_id_version_master_threat_cubes_id_version_fk" FOREIGN KEY ("threat_cube_id","version") REFERENCES "public"."master_threat_cubes"("id","version") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
