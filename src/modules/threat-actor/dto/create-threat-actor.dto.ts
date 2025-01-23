import { IsString, IsInt } from 'class-validator';
import { threatActorsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateThreatActorDto
  implements InferUpdate<typeof threatActorsTable>
{
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  intent: string;

  @IsString()
  rationale: string;

  @IsString()
  capabilities: string;

  @IsInt()
  project_id: number;
}
