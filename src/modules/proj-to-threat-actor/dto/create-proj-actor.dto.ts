import { IsInt } from 'class-validator';
import { projectsToThreatActorsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateProjectToThreatActorDto
  implements InferUpdate<typeof projectsToThreatActorsTable>
{
  @IsInt()
  project_id: number;

  @IsInt()
  threat_actor_id: number;
}
