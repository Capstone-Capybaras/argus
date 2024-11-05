export class CreateProjectDto {
    name: string;
    exercise_type: 'Executive' | 'Sectorial';
    start_date: string;
    end_date: string;
    email_header: string;
    email_footer: string;    
  }
  