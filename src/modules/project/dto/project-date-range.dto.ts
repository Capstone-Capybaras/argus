import { IsDateString } from 'class-validator';

export class ProjectDateRange {
  // TODO: test that this validator is running
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}
