import { IsString, IsInt } from 'class-validator';
import { masterThreatCubesTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateMasterThreatCubeDto
  implements InferInsert<typeof masterThreatCubesTable>
{
  @IsInt()
  threat_cube_id: string;

  // @IsString()
  // tactic: string;

  @IsString()
  name: string;
}
