ALTER TABLE "master_threat_cubes" ALTER COLUMN "tactic" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "entities_to_participants" ALTER COLUMN "participant_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "entities_to_participants" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "threat_landscape" ALTER COLUMN "entity_id" SET NOT NULL;