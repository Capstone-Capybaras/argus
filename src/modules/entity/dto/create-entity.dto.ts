// create-entity.dto.ts
import { IsNumber, IsString, IsArray } from 'class-validator';
import { entitiesTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateEntityDto implements InferInsert<typeof entitiesTable> {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  victim_sector: string;

  @IsString()
  CII: string;

  @IsString()
  critical_function: string;

  @IsArray()
  @IsString({ each: true })
  policy_documents: string[];

  // TODO: this refers to master threat cube, but need to decide on order of insertion and the join table insertion
  // @IsString()
  // real_threat_landscape?: string; // Add this field if optional

  @IsString()
  severity_levels: string;
}
