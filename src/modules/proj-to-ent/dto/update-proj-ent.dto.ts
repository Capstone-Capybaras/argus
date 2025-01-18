import { IsInt } from 'class-validator';
import { projectsToEntitiesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateProjectToEntityDto
  implements InferUpdate<typeof projectsToEntitiesTable>
{
  @IsInt()
  project_id: number;

  @IsInt()
  entity_id: number;
}
