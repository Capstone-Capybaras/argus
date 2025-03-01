import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';
import { SelectEntityDto } from 'src/modules/entity/dto/select-entity.dto';
import { SelectRoleDto } from 'src/modules/roles/dto/select-roles.dto';
import { SelectScenarioDto } from 'src/modules/scenario/dto/select-scenario.dto';
import { SelectTtpUsedDto } from 'src/modules/ttp-used/dto/select-ttp-used.dto';

export class AetherGenerateMselDto {
  job_id: number;
  project_id: number;
  start_datetime: string;
  end_datetime: string;
  additional_context?: string;

  scenario: SelectScenarioDto;
  ttpUsed: SelectTtpUsedDto[];
  entity: SelectEntityDto;
  asset: SelectAssetDto;
  roles: SelectRoleDto['name'][];
}
