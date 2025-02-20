import { jobsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateJobDto implements InferUpdate<typeof jobsTable> {
  id: number;
  status: 'pending' | 'failed' | 'done';
}
