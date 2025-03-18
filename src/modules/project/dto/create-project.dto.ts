// create-project.dto.ts
import {
  IsString,
  IsIn,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';
import { projectsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';
import { ProjectDateRange } from './project-date-range.dto';

export class CreateProjectDto implements InferInsert<typeof projectsTable> {
  @IsString()
  name: string;

  @IsString()
  client_name: string;

  @IsIn(['senior leader', 'sectorial', 'technical', 'regulatory compliance'])
  exercise_type:
    | 'senior leader'
    | 'sectorial'
    | 'technical'
    | 'regulatory compliance';

  @IsDateString()
  start_date: string;

  @IsDateString()
  //@Type(()=>Date)
  end_date: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeHtml(value))
  email_header?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeHtml(value))
  email_footer?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProjectDateRange)
  projected_exercise_dates?: ProjectDateRange[];
}
