import { jobsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateJobDto implements InferInsert<typeof jobsTable> {
  type: 'scenario' | 'msel' | 'threat';
  status: 'pending' | 'failed' | 'done';
  name: string;
  project_id: number;
}
