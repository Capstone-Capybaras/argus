CREATE TYPE "public"."threat_actor_motivation" AS ENUM('Financial Crime', 'Service Disruption', 'Information Theft and Espionage', 'Damage to Reputation');--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "threat_actor_motivation" SET DATA TYPE threat_actor_motivation USING (
  CASE
    WHEN threat_actor_motivation IN ('Financial Crime', 'Service Disruption', 'Information Theft and Espionage', 'Damage to Reputation')
      THEN threat_actor_motivation::threat_actor_motivation
    ELSE 'Financial Crime'::threat_actor_motivation
  END
);--> statement-breakpoint
ALTER TABLE "scenarios_generated" ALTER COLUMN "threat_actor_motivation" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios" ALTER COLUMN "threat_actor_motivation" SET DATA TYPE threat_actor_motivation USING (
  CASE
    WHEN threat_actor_motivation IN ('Financial Crime', 'Service Disruption', 'Information Theft and Espionage', 'Damage to Reputation')
      THEN threat_actor_motivation::threat_actor_motivation
    ELSE 'Financial Crime'::threat_actor_motivation
  END
);--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "components" json[];