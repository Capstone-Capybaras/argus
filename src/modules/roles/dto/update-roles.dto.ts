import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { rolesTable } from 'src/database/schema';
import { BatchOperationResponse } from 'src/utils/BatchOperationResponse';
import { InferUpdate } from 'src/utils/modelToDtoTypes';
import { SelectRoleDto } from './select-roles.dto';

export class UpdateRoleDto implements InferUpdate<typeof rolesTable> {
  @IsString()
  name: string;

  @IsInt()
  entity_id: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class BatchUpdateRolesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRoleDto)
  roles: UpdateRoleDto[];
}

export type BatchUpdateRolesResponse = BatchOperationResponse<
  SelectRoleDto,
  UpdateRoleDto
>;
