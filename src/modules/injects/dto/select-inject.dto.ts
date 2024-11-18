import { injectsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectInjectDto implements InferSelect<typeof injectsTable> {
  inject_id: string;
  scenario_number: string;
  entity_id: number;
  project_id: number;
  date_time: Date;
  inject_sent: boolean;
  inject_desc: string;
  inject_type: string;
  artefact: string;
  from: string;
  observation: string | null;
}
