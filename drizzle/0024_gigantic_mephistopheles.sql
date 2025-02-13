ALTER TABLE "threat_landscape" DROP CONSTRAINT "threat_landscape_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "threat_landscape" DROP CONSTRAINT "threat_landscape_project_id_entity_id_threat_actor_name_pk";--> statement-breakpoint
ALTER TABLE "threat_landscape" ADD CONSTRAINT "threat_landscape_entity_id_threat_actor_name_pk" PRIMARY KEY("entity_id","threat_actor_name");--> statement-breakpoint
ALTER TABLE "threat_landscape" DROP COLUMN IF EXISTS "project_id";