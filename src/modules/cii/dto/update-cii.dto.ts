import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';
import { CIITable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateCiiDto implements InferUpdate<typeof CIITable> {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  users?: string;

  @IsOptional()
  @IsString()
  function?: string;

  @IsOptional()
  @IsString()
  sensitive_info?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  entity_id?: number;
}
