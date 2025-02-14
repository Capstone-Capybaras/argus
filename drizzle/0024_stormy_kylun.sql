ALTER TABLE "participants" DROP CONSTRAINT "participants_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN IF EXISTS "entity_id";