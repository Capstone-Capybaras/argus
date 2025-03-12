import { ApiProperty } from '@nestjs/swagger';
import { scenariosTable } from 'src/database/schema';
import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';
import { SelectTtpUsedDto } from 'src/modules/ttp-used/dto/select-ttp-used.dto';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectScenarioDto implements InferSelect<typeof scenariosTable> {
  scenario_number: string;
  additional_context: string;
  scenario_title: string;

  @ApiProperty({
    enum: [
      'Financial Crime',
      'Service Disruption',
      'Information Theft and Espionage',
      'Damage to Reputation',
    ],
  })
  threat_actor_motivation:
    | 'Financial Crime'
    | 'Service Disruption'
    | 'Information Theft and Espionage'
    | 'Damage to Reputation';

  intended_system_impact: string;
  intended_biz_impact: string;
  attack_sophistication: string;
  severity_level: string;
  initial_access: string;
  exploit: string;
  impact: string;
  project_id: number;
  asset_id: number;
}

export class SelectScenarioByNumberDto extends SelectScenarioDto {
  ttp_used: SelectTtpUsedDto[];
  asset_name: string;
  entity_name: string;
}

export class SelectScenarioWithAssetDto extends SelectScenarioDto {
  assets: SelectAssetDto[];
}
