import { IsInt } from 'class-validator';
import { masterThreatCubesToThreatActorsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateMasterThreatCubesToThreatActorsDto
  implements InferUpdate<typeof masterThreatCubesToThreatActorsTable>
{
  @IsInt()
  threat_cube_id: number;

  @IsInt()
  threat_actor_id: number;
}
