import { IsString, IsInt, IsOptional } from 'class-validator';
import { ttpUsedTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateTtpUsedDto implements InferUpdate<typeof ttpUsedTable> {
  // primary key
  @IsInt()
  id: number;

  // foreign keys
  @IsInt()
  scenario_project_id: number;
  @IsString()
  scenario_number: string;

  @IsString()
  @IsOptional()
  tactic?: string;

  @IsString()
  @IsOptional()
  technique?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
