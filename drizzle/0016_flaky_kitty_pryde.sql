ALTER TABLE "tacticsTable" RENAME TO "tactics";--> statement-breakpoint
ALTER TABLE "master_threat_cubes" DROP CONSTRAINT "master_threat_cubes_tactic_tacticsTable_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "master_threat_cubes" ADD CONSTRAINT "master_threat_cubes_tactic_tactics_id_fk" FOREIGN KEY ("tactic") REFERENCES "public"."tactics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
