import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';
import { SelectEntityOnlyDto } from 'src/modules/entity/dto/select-entity.dto';
import { SelectScenarioDto } from 'src/modules/scenario/dto/select-scenario.dto';
import { SelectThreatLandscapeDto } from 'src/modules/threat-landscape/dto/select-threat-landscape.dto';

export class AetherGenerateScenarioDto {
  scenario_number: SelectScenarioDto['scenario_number'];
  project_id: SelectScenarioDto['project_id'];
  threat_actor_motivation: SelectScenarioDto['threat_actor_motivation'];
  additional_context?: SelectScenarioDto['additional_context'];
  job_id: number;

  entity: SelectEntityOnlyDto;
  asset: SelectAssetDto;

  threatLandscape?: SelectThreatLandscapeDto;
  ttpHeatMap?: Record<
    string,
    {
      technique: string;
      score: number;
    }[]
  >;
}
