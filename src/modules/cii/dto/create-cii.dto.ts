// create-cii.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';
import { CIITable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateCiiDto implements InferUpdate<typeof CIITable> {
  @IsNumber()
  id: number;

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
