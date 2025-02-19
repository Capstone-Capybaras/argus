import { scenariosTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

// TODO: class validator
export class CreateScenarioDto implements InferInsert<typeof scenariosTable> {
  scenario_number: string;
  additional_context: string;
  scenario_title: string;
  threat_actor_motivation: string;
  intended_system_impact: string;
  intended_biz_impact: string;
  attack_sophistication: string;
  severity_level: number;
  initial_access: string;
  exploit: string;
  impact: string;
  project_id: number;
  asset_id: number;
}
