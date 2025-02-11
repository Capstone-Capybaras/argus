CREATE TABLE IF NOT EXISTS "threat_landscape" (
	"project_id" integer,
	"entity_id" integer,
	"threat_actor_name" text,
	"category" text,
	"capability" text,
	"capability_reason" text,
	"intent" text,
	"intent_reason" text,
	"opportunity" text,
	"opportunity_reason" text,
	CONSTRAINT "threat_landscape_project_id_entity_id_threat_actor_name_pk" PRIMARY KEY("project_id","entity_id","threat_actor_name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_landscape" ADD CONSTRAINT "threat_landscape_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_landscape" ADD CONSTRAINT "threat_landscape_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
