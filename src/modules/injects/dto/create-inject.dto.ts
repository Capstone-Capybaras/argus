// create-inject.dto.ts
import { IsString, IsDate, IsNumber, IsInt } from 'class-validator';
import { injectsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateInjectDto implements InferInsert<typeof injectsTable> {
  @IsString()
  inject_id: string;

  @IsString()
  scenario_number: string;

  @IsNumber()
  entity_id: number;

  @IsNumber()
  scenario_project_id: number;

  @IsDate()
  date_time: Date;

  @IsString()
  inject_desc: string;

  @IsString()
  inject_type: string;

  @IsString()
  artefact: string;

  @IsString()
  from: string;

  @IsString()
  to_recipient: string;

  @IsInt()
  iteration: number;
}
