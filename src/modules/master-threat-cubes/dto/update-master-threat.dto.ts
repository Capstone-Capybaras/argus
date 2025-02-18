import { IsString, IsInt, IsOptional } from 'class-validator';
import { masterThreatCubesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateMasterThreatCubeDto
  implements InferUpdate<typeof masterThreatCubesTable>
{
  @IsInt()
  threat_cube_id: string;

  // @IsString()
  // @IsOptional()
  // tactic?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
