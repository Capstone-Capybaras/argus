import { IsString, IsInt } from 'class-validator';
import { masterThreatCubesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateMasterThreatCubeDto
  implements InferUpdate<typeof masterThreatCubesTable>
{
  @IsInt()
  threat_cube_id: number;

  @IsString()
  tactic: string;

  @IsString()
  name: string;
}
