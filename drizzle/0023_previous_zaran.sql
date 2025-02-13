CREATE TABLE IF NOT EXISTS "responses" (
	"inject_id" varchar NOT NULL,
	"response" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	CONSTRAINT "responses_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles_to_injects" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar NOT NULL,
	"role_entity_id" integer NOT NULL,
	"inject_id" varchar NOT NULL,
	CONSTRAINT "roles_to_injects_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_inject_id_injects_inject_id_fk" FOREIGN KEY ("inject_id") REFERENCES "public"."injects"("inject_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_to_injects" ADD CONSTRAINT "roles_to_injects_inject_id_injects_inject_id_fk" FOREIGN KEY ("inject_id") REFERENCES "public"."injects"("inject_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_to_injects" ADD CONSTRAINT "roles_to_injects_role_name_role_entity_id_roles_name_entity_id_fk" FOREIGN KEY ("role_name","role_entity_id") REFERENCES "public"."roles"("name","entity_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
