ALTER TABLE "assets" DROP CONSTRAINT "assets_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "assets_to_scenarios" DROP CONSTRAINT "assets_to_scenarios_asset_id_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "assets_to_scenarios" DROP CONSTRAINT "assets_to_scenarios_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk";
--> statement-breakpoint
ALTER TABLE "emails" DROP CONSTRAINT "emails_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "entities_to_participants" DROP CONSTRAINT "entities_to_participants_participant_email_participants_email_fk";
--> statement-breakpoint
ALTER TABLE "entities_to_participants" DROP CONSTRAINT "entities_to_participants_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "entities_to_threat_cubes" DROP CONSTRAINT "entities_to_threat_cubes_threat_cube_id_master_threat_cubes_thread_cube_id_fk";
--> statement-breakpoint
ALTER TABLE "injects" DROP CONSTRAINT "injects_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "injects" DROP CONSTRAINT "injects_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk";
--> statement-breakpoint
ALTER TABLE "participants_to_roles" DROP CONSTRAINT "participants_to_roles_participant_email_participants_email_fk";
--> statement-breakpoint
ALTER TABLE "participants_to_roles" DROP CONSTRAINT "participants_to_roles_role_name_role_entity_id_roles_name_entity_id_fk";
--> statement-breakpoint
ALTER TABLE "projects_to_entities" DROP CONSTRAINT "projects_to_entities_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "projects_to_entities" DROP CONSTRAINT "projects_to_entities_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "responses" DROP CONSTRAINT "responses_inject_id_injects_inject_id_fk";
--> statement-breakpoint
ALTER TABLE "roles" DROP CONSTRAINT "roles_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "roles_to_injects" DROP CONSTRAINT "roles_to_injects_inject_id_injects_inject_id_fk";
--> statement-breakpoint
ALTER TABLE "roles_to_injects" DROP CONSTRAINT "roles_to_injects_role_name_role_entity_id_roles_name_entity_id_fk";
--> statement-breakpoint
ALTER TABLE "scenarios" DROP CONSTRAINT "scenarios_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "scenarios" DROP CONSTRAINT "scenarios_asset_id_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "threat_landscape" DROP CONSTRAINT "threat_landscape_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "ttp_used" DROP CONSTRAINT "ttp_used_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets" ADD CONSTRAINT "assets_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets_to_scenarios" ADD CONSTRAINT "assets_to_scenarios_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets_to_scenarios" ADD CONSTRAINT "assets_to_scenarios_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk" FOREIGN KEY ("scenario_number","scenario_project_id") REFERENCES "public"."scenarios"("scenario_number","project_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_participants" ADD CONSTRAINT "entities_to_participants_participant_email_participants_email_fk" FOREIGN KEY ("participant_email") REFERENCES "public"."participants"("email") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_participants" ADD CONSTRAINT "entities_to_participants_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_threat_cube_id_master_threat_cubes_thread_cube_id_fk" FOREIGN KEY ("threat_cube_id") REFERENCES "public"."master_threat_cubes"("thread_cube_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "injects" ADD CONSTRAINT "injects_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk" FOREIGN KEY ("scenario_number","scenario_project_id") REFERENCES "public"."scenarios"("scenario_number","project_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participants_to_roles" ADD CONSTRAINT "participants_to_roles_participant_email_participants_email_fk" FOREIGN KEY ("participant_email") REFERENCES "public"."participants"("email") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "participants_to_roles" ADD CONSTRAINT "participants_to_roles_role_name_role_entity_id_roles_name_entity_id_fk" FOREIGN KEY ("role_name","role_entity_id") REFERENCES "public"."roles"("name","entity_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_to_entities" ADD CONSTRAINT "projects_to_entities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_to_entities" ADD CONSTRAINT "projects_to_entities_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "responses" ADD CONSTRAINT "responses_inject_id_injects_inject_id_fk" FOREIGN KEY ("inject_id") REFERENCES "public"."injects"("inject_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_to_injects" ADD CONSTRAINT "roles_to_injects_inject_id_injects_inject_id_fk" FOREIGN KEY ("inject_id") REFERENCES "public"."injects"("inject_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_to_injects" ADD CONSTRAINT "roles_to_injects_role_name_role_entity_id_roles_name_entity_id_fk" FOREIGN KEY ("role_name","role_entity_id") REFERENCES "public"."roles"("name","entity_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_landscape" ADD CONSTRAINT "threat_landscape_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ttp_used" ADD CONSTRAINT "ttp_used_scenario_number_scenario_project_id_scenarios_scenario_number_project_id_fk" FOREIGN KEY ("scenario_number","scenario_project_id") REFERENCES "public"."scenarios"("scenario_number","project_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
