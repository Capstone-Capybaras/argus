import { injectsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectInjectDto implements InferSelect<typeof injectsTable> {
  inject_id: string;
  scenario_number: string;
  scenario_project_id: number;
  date: string;
  time: string;
  inject_desc: string;
  inject_type: string;
  artefact: string | null;
  from: string;
  to_recipient: string;
  iteration: number;
  upload_key: string | null;
}
