import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  assetsTable,
  entitiesTable,
  jobsTable,
  scenariosTable,
} from 'src/database/schema';

export class GenerateScenarioDto {
  @IsString()
  @IsOptional()
  additional_context?: typeof scenariosTable.$inferSelect.scenario_number;

  @IsNumber()
  entity_id: typeof entitiesTable.$inferSelect.id;

  @IsNumber()
  asset_id: typeof assetsTable.$inferSelect.id;

  @IsString()
  job_name: typeof jobsTable.$inferInsert.name;
}
