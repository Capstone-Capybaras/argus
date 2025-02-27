import { injectsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectInjectDto implements InferSelect<typeof injectsTable> {
  id: number;
  inject_id: string;
  scenario_number: string | null;
  project_id: number;
  date: string | null;
  time: string | null;
  inject_desc: string;
  inject_type: string | null;
  artefact: string | null;
  from: string;
  to_recipient: string;
  iteration: number;
  upload_key: string | null;
}
