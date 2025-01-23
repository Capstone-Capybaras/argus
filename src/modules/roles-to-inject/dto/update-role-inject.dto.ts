import { IsString } from 'class-validator';
import { rolesToInjectsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateRolesToInjectDto
  implements InferUpdate<typeof rolesToInjectsTable>
{
  @IsString()
  role_name: string;

  @IsString()
  inject_id: string;
}
