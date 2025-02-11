import { scenariosTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectScenarioDto implements InferSelect<typeof scenariosTable> {
  CII: number;
  scenario_number: string;
  asset: string;
  additional_context: string;
  threat_actor_motivation: string;
  entity_id: number;
  intended_system_impact: string;
  intended_biz_impact: string;
  attack_solution: string;
  severity_level: number;
  initial_access: string;
  exploit: string;
  impact: string;
  project_id: number;
  tactics_techniques: string;
}
