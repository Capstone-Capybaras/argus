import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { jobsTable, projectsTable, scenariosTable } from 'src/database/schema';

export class GenerateMselDto {
  @IsString()
  @IsOptional()
  additional_context?: typeof scenariosTable.$inferSelect.scenario_number;

  @IsString()
  scenario_number: typeof scenariosTable.$inferInsert.scenario_number;

  @IsNumber()
  project_id: typeof projectsTable.$inferSelect.id;

  @IsString()
  job_name: typeof jobsTable.$inferSelect.name;

  @IsDateString()
  start_datetime: string;

  @IsDateString()
  end_datetime: string;
}
