import { SelectScenarioDto } from 'src/modules/scenario/dto/select-scenario.dto';

export class AetherGenerateMselDto {
  job_id: number;
  start_datetime: string;
  end_datetime: string;

  scenario: SelectScenarioDto;
}
