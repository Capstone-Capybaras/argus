export class AetherGenerateScenarioDto {
  scenario_number: string;
  project_id: number;
  additional_context?: string;
  job_id: number;

  entity: {
    entity_id: number;
    entity_name: string;
    entity_description: string;
    entity_victim_sector: string;
    entity_critical_function: string;
    entity_severity_levels?: string;
    entity_policy_documents: string[];
  };
  asset: {
    asset_id: number;
    asset_name: string;
    asset_function: string;
    asset_users: string;
    asset_sensitive_info: string;
    asset_category: string;
    asset_entity_id: number;
  };
}
