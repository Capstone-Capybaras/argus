// create-inject.dto.ts
import {
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { injectsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateInjectDto implements InferInsert<typeof injectsTable> {
  @IsNumber()
  project_id: number;

  @IsNumber()
  entity_id: number;

  @IsString()
  inject_id: string;

  @IsString()
  scenario_number: string;

  @IsDate()
  date_time: Date;

  @IsBoolean()
  inject_sent: boolean;

  @IsString()
  inject_desc: string;

  @IsString()
  inject_type: string;

  @IsString()
  artefact: string;

  @IsString()
  entity: string;

  @IsString()
  from: string;

  @IsString()
  to_recipient: string;

  @IsString()
  project: string;

  @IsString()
  @IsOptional()
  observation: string;
}
