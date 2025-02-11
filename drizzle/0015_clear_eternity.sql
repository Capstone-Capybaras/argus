ALTER TABLE "master_threat_cubes" RENAME COLUMN "id" TO "thread_cube_id";--> statement-breakpoint
ALTER TABLE "master_threat_cubes" DROP CONSTRAINT "master_threat_cubes_id_unique";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities_to_threat_cubes" ADD CONSTRAINT "entities_to_threat_cubes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_to_threat_cubes" ADD CONSTRAINT "projects_to_threat_cubes_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "master_threat_cubes" ADD CONSTRAINT "master_threat_cubes_thread_cube_id_unique" UNIQUE("thread_cube_id");