import { IsString, IsInt, IsOptional } from 'class-validator';
import { ttpUsedTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateTtpUsedDto implements InferInsert<typeof ttpUsedTable> {
  @IsInt()
  scenario_project_id: number;

  @IsString()
  scenario_number: string;

  @IsString()
  tactic: string;

  @IsString()
  @IsOptional()
  technique?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
