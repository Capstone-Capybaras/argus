import { IsString, IsBoolean, IsDate } from 'class-validator';
import { injectsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateInjectDto implements InferUpdate<typeof injectsTable> {
  @IsString()
  inject_id: string;

  @IsString()
  scenario_number: string;

  @IsDate()
  date_time: Date;

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
