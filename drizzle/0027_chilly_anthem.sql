ALTER TABLE "participants_to_roles" DROP CONSTRAINT "participants_to_roles_role_name_roles_name_fk";
--> statement-breakpoint
ALTER TABLE "roles_to_injects" DROP CONSTRAINT "roles_to_injects_role_name_roles_name_fk";
--> statement-breakpoint
ALTER TABLE "participants_to_roles" DROP CONSTRAINT "participants_to_roles_participant_email_role_name_pk";--> statement-breakpoint
ALTER TABLE "roles_to_injects" DROP CONSTRAINT "roles_to_injects_role_name_inject_id_pk";--> statement-breakpoint
ALTER TABLE "participants_to_roles" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "participants_to_roles" ADD COLUMN "role_entity_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "roles_to_injects" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "roles_to_injects" ADD COLUMN "role_entity_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participants_to_roles" ADD CONSTRAINT "participants_to_roles_role_name_role_entity_id_roles_name_entity_id_fk" FOREIGN KEY ("role_name","role_entity_id") REFERENCES "public"."roles"("name","entity_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_to_injects" ADD CONSTRAINT "roles_to_injects_role_name_role_entity_id_roles_name_entity_id_fk" FOREIGN KEY ("role_name","role_entity_id") REFERENCES "public"."roles"("name","entity_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "participants_to_roles" ADD CONSTRAINT "participants_to_roles_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "roles_to_injects" ADD CONSTRAINT "roles_to_injects_id_unique" UNIQUE("id");