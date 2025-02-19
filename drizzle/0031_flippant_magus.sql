ALTER TABLE "scenarios_generated" ALTER COLUMN "additional_context" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "threat_actor_motivation" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "intended_system_impact" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "intended_biz_impact" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "attack_sophistication" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "severity_level" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "initial_access" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "exploit" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "impact" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "generation_inputs" SET NOT NULL;