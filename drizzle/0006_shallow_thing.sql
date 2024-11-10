ALTER TABLE "entity" DROP CONSTRAINT "entity_name_unique";--> statement-breakpoint
ALTER TABLE "entity" ADD PRIMARY KEY ("name");