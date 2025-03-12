import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  assetsTable,
  entitiesTable,
  projectsTable,
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
  scenario_number: typeof scenariosTable.$inferInsert.scenario_number;

  @IsNumber()
  project_id: typeof projectsTable.$inferSelect.id;

  @IsIn([
    'Financial Crime',
    'Service Disruption',
    'Information Theft and Espionage',
    'Damage to Reputation',
  ])
  threat_actor_motivation: typeof scenariosTable.$inferInsert.threat_actor_motivation;
}
