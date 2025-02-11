import { IsString, IsInt } from 'class-validator';
import { ttpUsedTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateTtpUsedDto implements InferUpdate<typeof ttpUsedTable> {
  @IsInt()
  project_id: number;

  @IsString()
  scenario_number: string;

  @IsString()
  tactic: string;

  @IsString()
  technique: string;

  @IsString()
  notes: string;
}
