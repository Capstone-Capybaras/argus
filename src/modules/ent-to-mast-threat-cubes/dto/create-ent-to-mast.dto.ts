import { IsInt } from 'class-validator';
import { entitiesToMasterThreatCubesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateEntToMasterThreatCubes
  implements InferUpdate<typeof entitiesToMasterThreatCubesTable>
{
  @IsInt()
  master_threat_cube_id: number;

  @IsInt()
  entity_id: number;
}
