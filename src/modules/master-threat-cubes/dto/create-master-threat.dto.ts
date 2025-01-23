import { IsString, IsInt } from 'class-validator';
import { masterThreatCubesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateMasterThreatCubeDto
  implements InferUpdate<typeof masterThreatCubesTable>
{
  @IsString()
  category: string;

  @IsString()
  name: string;

  @IsInt()
  id: number;
}
