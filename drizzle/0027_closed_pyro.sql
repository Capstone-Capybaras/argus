CREATE TABLE IF NOT EXISTS "cubes_to_tactics" (
	"tactic_id" text NOT NULL,
	"technique_id" text NOT NULL,
	CONSTRAINT "cubes_to_tactics_tactic_id_technique_id_pk" PRIMARY KEY("tactic_id","technique_id")
);
--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_threat_cube_id_master_threat_cubes_thread_cube_id_fk";
--> statement-breakpoint
ALTER TABLE "master_threat_cubes" DROP CONSTRAINT "master_threat_cubes_tactic_tactics_id_fk";
--> statement-breakpoint
ALTER TABLE "master_threat_cubes" DROP COLUMN IF EXISTS "thread_cube_id";--> statement-breakpoint
ALTER TABLE "master_threat_cubes" ADD COLUMN "threat_cube_id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cubes_to_tactics" ADD CONSTRAINT "cubes_to_tactics_tactic_id_tactics_id_fk" FOREIGN KEY ("tactic_id") REFERENCES "public"."tactics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cubes_to_tactics" ADD CONSTRAINT "cubes_to_tactics_technique_id_master_threat_cubes_threat_cube_id_fk" FOREIGN KEY ("technique_id") REFERENCES "public"."master_threat_cubes"("threat_cube_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" ALTER COLUMN "threat_cube_id" SET DATA TYPE text;
DO $$ BEGIN
 ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_threat_cube_id_master_threat_cubes_threat_cube_id_fk" FOREIGN KEY ("threat_cube_id") REFERENCES "public"."master_threat_cubes"("threat_cube_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "master_threat_cubes" DROP COLUMN IF EXISTS "tactic";