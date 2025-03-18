import { ApiProperty } from '@nestjs/swagger';
import { projectsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';
import { ProjectDateRange } from './project-date-range.dto';

export class SelectProjectDto implements InferSelect<typeof projectsTable> {
  id: number;
  name: string;
  client_name: string;
  // Note: for swagger to work properly, we either need to define this ApiProperty for enum/TS unions
  // or if we are using class validator decorators as in the create project DTO then this is not needed
  @ApiProperty({
    enum: ['senior leader', 'sectorial', 'technical', 'regulatory compliance'],
  })
  exercise_type:
    | 'senior leader'
    | 'sectorial'
    | 'technical'
    | 'regulatory compliance';
  start_date: string;
  end_date: string;
  email_header: string | null;
  email_footer: string | null;
  projected_exercise_dates: ProjectDateRange[] | null;
}
