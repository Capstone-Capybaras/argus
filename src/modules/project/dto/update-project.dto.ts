import { IsString, IsDateString, IsIn, IsNumber } from 'class-validator';
import { projectsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateProjectDto implements InferUpdate<typeof projectsTable> {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsIn(['executive', 'sectorial'])
  exercise_type: 'executive' | 'sectorial';

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsString()
  email_header: string;

  @IsString()
  email_footer: string;
}
