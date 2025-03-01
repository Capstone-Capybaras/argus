import { SelectEntityOnlyDto } from 'src/modules/entity/dto/select-entity.dto';
import { SelectAssetDto } from 'src/modules/assets/dto/select-asset.dto';

export class AetherGenerateThreatLandscapeDto{
    job_id: number;
    entity: SelectEntityOnlyDto;
    assets: SelectAssetDto[];
    file_key: string;
}