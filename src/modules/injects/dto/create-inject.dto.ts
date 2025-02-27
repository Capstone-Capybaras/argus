// create-inject.dto.ts
import {
  IsString,
  IsNumber,
  IsInt,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { injectsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateInjectDto implements InferInsert<typeof injectsTable> {
  @IsString()
  inject_id: string;

  @IsString()
  scenario_number: string | null;

  @IsNumber()
  project_id: number;

  @IsDateString() // Ensures date is in "YYYY-MM-DD" format
  date: string | null;

  @IsString() // Ensures time is in "HH:MM:SS" format
  time: string | null;

  @IsString()
  inject_desc: string;

  @IsString()
  inject_type: string | null;

  @IsOptional() // Makes artefact nullable
  @IsString()
  artefact?: string | null;

  @IsString()
  from: string;

  @IsString()
  to_recipient: string;

  @IsInt()
  iteration: number;

  @IsString()
  @IsOptional() // upload key is nullable
  upload_key?: string | null;
}
