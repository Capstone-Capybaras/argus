// create-project.dto.ts
import { IsString, IsIn, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';
import { projectsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateProjectDto implements InferInsert<typeof projectsTable> {
  @IsString()
  name: string;

  @IsIn(['executive', 'sectorial'])
  exercise_type: 'executive' | 'sectorial';

  @IsDateString()
  start_date: string;

  @IsDateString()
  //@Type(()=>Date)
  end_date: string;

  @IsString()
  @Transform(({ value }) => sanitizeHtml(value))
  email_header: string;

  @IsString()
  @Transform(({ value }) => sanitizeHtml(value))
  email_footer: string;

  // @IsString()
  // entity_name: string;
}
