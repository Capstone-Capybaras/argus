CREATE TABLE IF NOT EXISTS "master_threat_cubes" (
	"category" text NOT NULL,
	"name" text PRIMARY KEY NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "master_threat_landscape" RENAME TO "entity_threat_cube";--> statement-breakpoint
ALTER TABLE "entity" ADD COLUMN "participants" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "entity" ADD COLUMN "real_threat_landscape" varchar;--> statement-breakpoint
ALTER TABLE "entity_threat_cube" ADD COLUMN "entity_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "entity_threat_cube" ADD COLUMN "entity_id" integer PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "entity_threat_cube" ADD COLUMN "threat_cube_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "entity_threat_cube" ADD COLUMN "score" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "entity_name" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity" ADD CONSTRAINT "entity_participants_participants_email_fk" FOREIGN KEY ("participants") REFERENCES "public"."participants"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity" ADD CONSTRAINT "entity_real_threat_landscape_master_threat_cubes_name_fk" FOREIGN KEY ("real_threat_landscape") REFERENCES "public"."master_threat_cubes"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_to_recipient_role_name_fk" FOREIGN KEY ("to_recipient") REFERENCES "public"."role"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_threat_cube" ADD CONSTRAINT "entity_threat_cube_entity_name_entity_name_fk" FOREIGN KEY ("entity_name") REFERENCES "public"."entity"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_threat_cube" ADD CONSTRAINT "entity_threat_cube_threat_cube_id_master_threat_cubes_id_fk" FOREIGN KEY ("threat_cube_id") REFERENCES "public"."master_threat_cubes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_entity_name_entity_name_fk" FOREIGN KEY ("entity_name") REFERENCES "public"."entity"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_actor" ADD CONSTRAINT "threat_actor_threat_landscape_master_threat_cubes_name_fk" FOREIGN KEY ("threat_landscape") REFERENCES "public"."master_threat_cubes"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "entity_threat_cube" DROP COLUMN IF EXISTS "category";--> statement-breakpoint
ALTER TABLE "entity_threat_cube" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "entity_threat_cube" DROP COLUMN IF EXISTS "pillar";