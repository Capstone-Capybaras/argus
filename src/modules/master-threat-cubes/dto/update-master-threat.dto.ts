import { IsString, IsOptional } from 'class-validator';
import { masterThreatCubesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateMasterThreatCubeDto
  implements InferUpdate<typeof masterThreatCubesTable>
{
  @IsString()
  id: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  version?: string;
}
