import {
  IsString,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';
import { projectsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateProjectDto implements InferUpdate<typeof projectsTable> {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsIn(['executive', 'sectorial'])
  @IsOptional()
  exercise_type?: 'executive' | 'sectorial';

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
}
