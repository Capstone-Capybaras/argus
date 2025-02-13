CREATE TABLE IF NOT EXISTS "entities_to_participants" (
	"participant_email" integer,
	"entity_id" integer,
	CONSTRAINT "entities_to_participants_participant_email_entity_id_pk" PRIMARY KEY("participant_email","entity_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_participants" ADD CONSTRAINT "entities_to_participants_participant_email_participants_email_fk" FOREIGN KEY ("participant_email") REFERENCES "public"."participants"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_participants" ADD CONSTRAINT "entities_to_participants_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
