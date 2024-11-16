ALTER TABLE "injects" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "participants_to_roles" ALTER COLUMN "participant_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "participants_to_roles" ALTER COLUMN "role_name" SET NOT NULL;