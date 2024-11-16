// create-project.dto.ts
import { IsString, IsDate, IsIn } from 'class-validator';
import { projectsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateProjectDto implements InferInsert<typeof projectsTable> {
  @IsString()
  name: string;

  @IsIn(['Executive', 'Sectorial'])
  exercise_type: 'Executive' | 'Sectorial';

  @IsDate()
  start_date: string;

  @IsDate()
  end_date: string;

  @IsString()
  email_header: string;

  @IsString()
  email_footer: string;

  @IsString()
  entity_name: string;
}
