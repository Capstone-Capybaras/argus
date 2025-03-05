import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';
import { SelectEntityOnlyDto } from 'src/modules/entity/dto/select-entity.dto';
import { SelectThreatLandscapeDto } from 'src/modules/threat-landscape/dto/select-threat-landscape.dto';

export class AetherGenerateScenarioDto {
  scenario_number: string;
  project_id: number;
  additional_context?: string;
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
