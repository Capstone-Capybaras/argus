import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';
import { entitiesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateEntityDto implements InferUpdate<typeof entitiesTable> {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  victim_sector?: string;

  @IsString()
  @IsOptional()
  critical_function?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  policy_documents?: string[];

  @IsString()
  @IsOptional()
  severity_levels: string;
}
