import { IsString, IsInt } from 'class-validator';
import { rolesToInjectsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateRolesToInjectDto
  implements InferUpdate<typeof rolesToInjectsTable>
{
  @IsString()
  role_name: string;

  @IsString()
  inject_id: string;
}
