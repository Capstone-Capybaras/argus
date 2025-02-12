import { entitiesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';
import { SelectParticipantDto } from 'src/modules/participants/dto/select-participant.dto';
import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';
import { DeepSet } from 'src/utils/DeepSet';

export class SelectEntityOnlyDto implements InferSelect<typeof entitiesTable> {
  id: number;
  name: string;
  description: string;
  victim_sector: string;
  critical_function: string;
  policy_documents: string[];
  severity_levels: string | null;
}
export class SelectEntityDto extends SelectEntityOnlyDto {
  participants?: SelectParticipantDto[];
  assets?: SelectAssetDto[];
}

/**
 * for entity service
 */
export class ISelectEntity extends SelectEntityOnlyDto {
  participants: DeepSet<SelectParticipantDto>;
  assets: DeepSet<SelectAssetDto>;
}
