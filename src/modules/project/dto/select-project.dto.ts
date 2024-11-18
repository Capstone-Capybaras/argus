import { ApiProperty } from '@nestjs/swagger';
import { projectsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectProjectDto implements InferSelect<typeof projectsTable> {
  id: number;
  name: string;
  // Note: for swagger to work properly, we either need to define this ApiProperty for enum/TS unions
  // or if we are using class validator decorators as in the create project DTO then this is not needed
  @ApiProperty({ enum: ['Executive', 'Sectorial'] })
  exercise_type: 'Executive' | 'Sectorial';
  start_date: string;
  end_date: string;
  email_header: string;
  email_footer: string;
}
