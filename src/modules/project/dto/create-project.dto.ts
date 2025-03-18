// create-project.dto.ts
import { IsString, IsIn, IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';
import { projectsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateProjectDto implements InferInsert<typeof projectsTable> {
  @IsString()
  name: string;

  @IsString()
  client_name: string;

  @IsIn(['executive', 'sectorial'])
  exercise_type: 'executive' | 'sectorial';

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
}
