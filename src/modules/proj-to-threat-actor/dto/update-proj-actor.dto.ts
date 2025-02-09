import { IsInt } from 'class-validator';
import { projectsToThreatActorsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateProjectToThreatActorDto
  implements InferUpdate<typeof projectsToThreatActorsTable>
{
  @IsInt()
  project_id: number;

  @IsInt()
  threat_cube_id: number;

  @IsInt()
  score: number;
}
