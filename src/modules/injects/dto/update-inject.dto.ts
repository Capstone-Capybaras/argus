import {
  IsString,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNumber,
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

  @IsDate()
  @IsOptional()
  date_time?: Date;

  @IsBoolean()
  @IsOptional()
  inject_sent?: boolean;

  @IsString()
  @IsOptional()
  inject_desc?: string;

  @IsString()
  @IsOptional()
  inject_type?: string;

  @IsString()
  @IsOptional()
  artefact?: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to_recipient?: string;
}
