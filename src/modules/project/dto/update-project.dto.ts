import {
  IsString,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';
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
  email_header?: string;

  @IsString()
  @IsOptional()
  email_footer?: string;
}
