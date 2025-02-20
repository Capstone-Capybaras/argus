import { jobsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectJobDto implements InferSelect<typeof jobsTable> {
  id: number;
  type: 'scenario' | 'msel' | 'threat';
  status: 'pending' | 'failed' | 'done';
  created_at: Date;
  name: string;
}
