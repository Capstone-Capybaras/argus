import { scenariosTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

// TODO: class validator
export class UpdateScenarioDto implements InferUpdate<typeof scenariosTable> {
  // primary keys
  scenario_number: string;
  project_id: number;
  scenario_title?: string;
  additional_context?: string;
  threat_actor_motivation?: string;
  intended_system_impact?: string;
  intended_biz_impact?: string;
  attack_sophistication?: string;
  severity_level?: string;
  initial_access?: string;
  exploit?: string;
  impact?: string;
  asset_id?: number;
}
