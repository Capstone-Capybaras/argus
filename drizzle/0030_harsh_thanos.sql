ALTER TABLE "scenarios" RENAME COLUMN "attack_solution" TO "attack_sophistication";--> statement-breakpoint
ALTER TABLE "scenarios" DROP CONSTRAINT "scenarios_tactics_techniques_master_threat_cubes_name_fk";
--> statement-breakpoint
ALTER TABLE "scenarios" DROP COLUMN IF EXISTS "tactics_techniques";