import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { jobsTable } from 'src/database/schema';
import { CreateScenarioDto } from './create-scenario.dto';
import { Type } from 'class-transformer';
import { CreateTtpUsedDto } from 'src/modules/ttp-used/dto/create-ttp-used.dto';

export class GenerateScenarioCallbackDto {
  @IsNumber()
  job_id: typeof jobsTable.$inferSelect.id;

  @IsIn(['pending', 'failed', 'done'])
  job_status: typeof jobsTable.$inferSelect.status;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScenarioDto)
  scenarios?: CreateScenarioDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTtpUsedDto)
  ttpUsed?: CreateTtpUsedDto[];
}
