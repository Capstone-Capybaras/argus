import { IsString, IsDateString, IsIn } from 'class-validator';

export class UpdateProjectDto {
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
