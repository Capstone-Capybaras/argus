import { ttpUsedTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectTtpUsedDto implements InferSelect<typeof ttpUsedTable> {
  id: number;
  scenario_project_id: number;
  scenario_number: string;
  tactic: string;
  technique: string | null;
  notes: string | null;
}
