import { scenariosTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

// TODO: class validator
export class CreateScenarioDto implements InferInsert<typeof scenariosTable> {
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
  CII: number;
  tactics_techniques: string;
}
