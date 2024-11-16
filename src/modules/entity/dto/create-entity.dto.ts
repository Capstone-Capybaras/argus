// create-entity.dto.ts
import { IsString } from 'class-validator';
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
  CII: string;

  @IsString()
  critical_function: string;

  @IsString()
  policy_documents: string;

  @IsString()
  participants: string;

  // TODO: this refers to master threat cube, but need to decide on order of insertion and the join table insertion
  @IsString()
  real_threat_landscape?: string; // Add this field if optional
}
