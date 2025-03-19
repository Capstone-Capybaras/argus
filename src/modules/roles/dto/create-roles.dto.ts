import { IsString, IsInt, IsOptional } from 'class-validator';
import { rolesTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateRoleDto implements InferInsert<typeof rolesTable> {
  @IsString()
  name: string;

  @IsInt()
  entity_id: number;

  @IsString()
  @IsOptional()
  description?: string;
}
