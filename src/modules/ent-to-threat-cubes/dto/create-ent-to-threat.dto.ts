import { IsInt } from 'class-validator';
import { entitiesToThreatCubesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateEntToThreatDto
  implements InferUpdate<typeof entitiesToThreatCubesTable>
{
  @IsInt()
  entity_id: number;

  @IsInt()
  score: number;

  @IsInt()
  threat_cube_id: number;
}
