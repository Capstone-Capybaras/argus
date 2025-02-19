import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { injectsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateInjectDto implements InferUpdate<typeof injectsTable> {
  @IsString()
  inject_id: string;

  @IsString()
  @IsOptional()
  scenario_number?: string;

  @IsNumber()
  @IsOptional()
  entity_id?: number;

  @IsNumber()
  @IsOptional()
  scenario_project_id?: number;

  @IsDateString() // Ensures date is in "YYYY-MM-DD" format
  @IsOptional()
  date?: string;

  @IsDateString() // Ensures time is in "HH:MM:SS" format
  @IsOptional()
  time?: string;

  @IsString()
  @IsOptional()
  inject_desc?: string;

  @IsString()
  @IsOptional()
  inject_type?: string;

  @IsString()
  @IsOptional()
  artefact?: string | null;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to_recipient?: string;

  @IsInt()
  @IsOptional()
  iteration?: number;
}
