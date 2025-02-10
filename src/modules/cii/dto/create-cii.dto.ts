// create-cii.dto.ts
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { CIITable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateCiiDto implements InferInsert<typeof CIITable> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  users: string;

  @IsNotEmpty()
  @IsString()
  function: string;

  @IsString()
  sensitive_info: string;

  @IsString()
  category: string;

  @IsInt()
  entity_id: number;
}
