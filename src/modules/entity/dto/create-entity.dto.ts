// create-entity.dto.ts
import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { entitiesTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateEntityDto implements InferInsert<typeof entitiesTable> {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  victim_sector: string;

  @IsString()
  critical_function: string;

  @IsArray()
  @IsString({ each: true })
  policy_documents: string[];

  // TODO: this refers to master threat cube, but need to decide on order of insertion and the join table insertion
  // @IsString()
  // real_threat_landscape?: string; // Add this field if optional

  @IsString()
  @IsOptional()
  severity_levels?: string;

  @IsNumber()
  project_id: number; // used for assigning to join table
}
