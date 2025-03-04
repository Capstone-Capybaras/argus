import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';
import { SelectEntityOnlyDto } from 'src/modules/entity/dto/select-entity.dto';
import { SelectProjectDto } from 'src/modules/project/dto/select-project.dto';
import { SelectRoleDto } from 'src/modules/roles/dto/select-roles.dto';
import { SelectScenarioDto } from 'src/modules/scenario/dto/select-scenario.dto';
import { SelectTtpUsedDto } from 'src/modules/ttp-used/dto/select-ttp-used.dto';

export class AetherGenerateMselDto {
  job_id: number;
  project_id: number;
  start_datetime: string;
  end_datetime: string;
  additional_context?: string;
  exercise_type: SelectProjectDto['exercise_type'];
  scenario: SelectScenarioDto;
  ttpUsed: SelectTtpUsedDto[];
  entity: SelectEntityOnlyDto;
  asset: SelectAssetDto;
  roles: SelectRoleDto['name'][];
}
