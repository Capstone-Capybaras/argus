import { IsNumber, IsString, IsArray } from 'class-validator';
import { entitiesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateEntityDto implements InferUpdate<typeof entitiesTable> {
  @IsNumber()
  id: number;

  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsString()
  victim_sector?: string;

  @IsString()
  CII?: string;

  @IsString()
  critical_function?: string;

  @IsArray()
  @IsString({ each: true })
  policy_documents: string[];

  @IsString()
  severity_levels: string;
}
