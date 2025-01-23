import { IsString, IsInt } from 'class-validator';
import { rolesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateRoleDto implements InferUpdate<typeof rolesTable> {
  @IsString()
  name: string;

  @IsInt()
  project_id: number;
}
