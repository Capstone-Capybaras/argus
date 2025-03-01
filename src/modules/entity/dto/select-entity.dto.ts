import { entitiesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';
import { ParticipantWithRoles } from 'src/modules/participants/dto/select-participant.dto';
import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';

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
  participants?: ParticipantWithRoles[];
  assets?: SelectAssetDto[];
}

type AssetSimple = Pick<SelectAssetDto, 'id' | 'name'>;

export class SelectEntityWithAssetSimpleDto {
  id: typeof entitiesTable.$inferSelect.id;
  name: typeof entitiesTable.$inferSelect.name;

  assets: AssetSimple[];
}
