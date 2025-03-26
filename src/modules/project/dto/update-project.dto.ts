import {
  IsString,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';
import { projectsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';
import { IsDateBetweenRangeDecorator } from 'src/validators/date-between-range.decorator';

export class UpdateProjectDto implements InferUpdate<typeof projectsTable> {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  client_name?: string;

  @IsIn(['senior leader', 'sectorial', 'technical', 'regulatory compliance'])
  @IsOptional()
  exercise_type?:
    | 'senior leader'
    | 'sectorial'
    | 'technical'
    | 'regulatory compliance';

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

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
  @IsDateString({}, { each: true })
  @IsDateBetweenRangeDecorator()
  projected_exercise_dates?: string[];
}
