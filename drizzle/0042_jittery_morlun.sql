CREATE TABLE IF NOT EXISTS "threat_files" (
	"entity_id" integer NOT NULL,
	"file_key" varchar NOT NULL,
	"date_uploaded" timestamp NOT NULL,
	CONSTRAINT "threat_files_entity_id_file_key_pk" PRIMARY KEY("entity_id","file_key")
);
--> statement-breakpoint
ALTER TABLE "threat_files" DROP CONSTRAINT "threat_files_entity_id_file_key_pk";--> statement-breakpoint
ALTER TABLE "threat_files" ADD PRIMARY KEY ("file_key");
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "threat_landscape_generated" (
	"entity_id" integer NOT NULL,
	"threat_actor_name" text,
	"category" text,
	"capability" text,
	"capability_reason" text,
	"intent" text,
	"intent_reason" text,
	"opportunity" text,
	"opportunity_reason" text,
	"generation_inputs" json NOT NULL,
	CONSTRAINT "threat_landscape_generated_entity_id_threat_actor_name_pk" PRIMARY KEY("entity_id","threat_actor_name")
);
--> statement-breakpoint
ALTER TABLE "threat_landscape" ADD COLUMN "file_key" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_landscape_generated" ADD CONSTRAINT "threat_landscape_generated_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_landscape" ADD CONSTRAINT "threat_landscape_file_key_threat_files_file_key_fk" FOREIGN KEY ("file_key") REFERENCES "public"."threat_files"("file_key") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
