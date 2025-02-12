DROP TABLE "CII_to_scenarios";--> statement-breakpoint
ALTER TABLE "CII" RENAME TO "assets";--> statement-breakpoint
ALTER TABLE "scenarios" RENAME COLUMN "CII" TO "asset_id";--> statement-breakpoint
ALTER TABLE "assets" DROP CONSTRAINT "CII_id_unique";--> statement-breakpoint
ALTER TABLE "assets" DROP CONSTRAINT "CII_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "scenarios" DROP CONSTRAINT "scenarios_CII_CII_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets" ADD CONSTRAINT "assets_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "scenarios" DROP COLUMN IF EXISTS "asset";--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_id_unique" UNIQUE("id");