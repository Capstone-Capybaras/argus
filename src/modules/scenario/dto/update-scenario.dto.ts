import { scenariosTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

// TODO: class validator
export class UpdateScenarioDto implements InferUpdate<typeof scenariosTable> {
  scenario_number: string;

  threat_actor?: string;
  threat_actor_motivation?: string;
  entity?: string;
  asset_id?: number;
  intended_system_impact?: string;
  intended_biz_impact?: string;
  attack_solution?: string;
  severity_level?: number;
  initial_access?: string;
  exploit?: string;
  impact?: string;
  tactics_techniques?: string;
  project?: string;
}
