import { IsString, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateInjectDto {
  @IsString()
  inject_id: string;

  @IsString()
  scenario_number: string;

  @IsDateString()
  date_time: string;

  @IsBoolean()
  inject_sent: boolean;

  @IsString()
  inject_desc: string;

  @IsString()
  inject_type: string;

  @IsString()
  artefact: string;

  @IsString()
  entity: string;

  @IsString()
  from: string;

  @IsString()
  to_recipient: string;

  @IsString()
  project: string;

  @IsString()
  observation: string;
}
