import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateInjectDto } from './create-inject.dto';
import { Type } from 'class-transformer';
import { jobsTable } from 'src/database/schema';

export class GenerateMselCallbackDto {
  @IsNumber()
  job_id: typeof jobsTable.$inferSelect.id;

  @IsIn(['pending', 'failed', 'done'])
  job_status: typeof jobsTable.$inferSelect.status;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateInjectDto)
  injects?: CreateInjectDto[];
}
