import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';
import { SelectEntityOnlyDto } from 'src/modules/entity/dto/select-entity.dto';

export class AetherGenerateScenarioDto {
  scenario_number: string;
  project_id: number;
  additional_context?: string;
  job_id: number;

  entity: SelectEntityOnlyDto;
  asset: SelectAssetDto;
}
