import { IsString, IsInt, IsOptional } from 'class-validator';
import { rolesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateRoleDto implements InferUpdate<typeof rolesTable> {
  @IsString()
  name: string;

  @IsInt()
  @IsOptional()
  entity_id?: number;
}
