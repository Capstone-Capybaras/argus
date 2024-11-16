import { IsString, IsDateString, IsIn } from 'class-validator';
import { projectsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateProjectDto implements InferUpdate<typeof projectsTable> {
  @IsString()
  name: string;

  @IsIn(['Executive', 'Sectorial'])
  exercise_type: 'Executive' | 'Sectorial';

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsString()
  email_header: string;

  @IsString()
  email_footer: string;
}
