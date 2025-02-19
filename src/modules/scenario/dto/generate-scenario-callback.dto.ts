import { IsIn, IsNumber, IsString } from 'class-validator';
import { jobsTable, scenariosTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class GenerateScenarioCallbackDto
  implements InferInsert<typeof scenariosTable>
{
  @IsString()
  scenario_number: string;

  @IsString()
  additional_context: string;

  @IsString()
  threat_actor_motivation: string;

  @IsString()
  intended_system_impact: string;

  @IsString()
  intended_biz_impact: string;

  @IsString()
  attack_sophistication: string;

  @IsNumber()
  severity_level: number;

  @IsString()
  initial_access: string;

  @IsString()
  exploit: string;

  @IsString()
  impact: string;

  @IsNumber()
  project_id: number;

  @IsNumber()
  asset_id: number;

  @IsNumber()
  job_id: typeof jobsTable.$inferSelect.id;

  @IsIn(['pending', 'failed', 'done'])
  job_status: typeof jobsTable.$inferSelect.status;
}
