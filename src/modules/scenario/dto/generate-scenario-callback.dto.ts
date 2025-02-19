import {
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { jobsTable } from 'src/database/schema';
import { CreateScenarioDto } from './create-scenario.dto';
import { Type } from 'class-transformer';

export class GenerateScenarioCallbackDto {
  @IsNumber()
  job_id: typeof jobsTable.$inferSelect.id;

  @IsIn(['pending', 'failed', 'done'])
  job_status: typeof jobsTable.$inferSelect.status;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateScenarioDto)
  scenario?: CreateScenarioDto;
}
