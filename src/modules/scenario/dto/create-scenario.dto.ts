import { scenariosTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateScenarioDto implements InferInsert<typeof scenariosTable> {
  asset: string;
  additional_context: string;
  threat_actor_id: number;
  entity_id: number;
  project_id: number;
  scenario_number: string;
  threat_actor: string;
  threat_actor_motivation: string;
  entity: string;
  CII: string;
  intended_system_impact: string;
  intended_biz_impact: string;
  attack_solution: string;
  severity_level: number;
  initial_access: string;
  exploit: string;
  impact: string;
  tactics_techniques: string;
  project: string;
}
