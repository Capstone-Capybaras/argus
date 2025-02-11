import { IsString, IsInt, IsNumber } from 'class-validator';
import { threatActorsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateThreatActorDto
  implements InferUpdate<typeof threatActorsTable>
{
  @IsNumber()
  id: number;

  @IsString()
  name?: string;

  @IsString()
  category?: string;

  @IsString()
  intent?: string;

  @IsString()
  rationale?: string;

  @IsString()
  capabilities?: string;

  @IsInt()
  project_id?: number;
}
