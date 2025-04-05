import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';
import { SelectEntityOnlyDto } from 'src/modules/entity/dto/select-entity.dto';
import { SelectScenarioDto } from 'src/modules/scenario/dto/select-scenario.dto';

export class AetherScenarioLearningDto {
  scenario_number: SelectScenarioDto['scenario_number'];
  project_id: SelectScenarioDto['project_id'];
  scenario: SelectScenarioDto;
  job_id: number;
  entity: SelectEntityOnlyDto;
  asset: SelectAssetDto;
}