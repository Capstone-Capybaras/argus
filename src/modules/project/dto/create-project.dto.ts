// create-project.dto.ts
import { IsString, IsDate, IsOptional, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsIn(['Executive', 'Sectorial'])
  exercise_type: 'Executive' | 'Sectorial';

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

  @IsString()
  email_header: string;

  @IsString()
  email_footer: string;

  @IsString()
  entity_name: string;
}
