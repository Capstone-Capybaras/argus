import { IsIn, IsNumber } from 'class-validator';
import { jobsTable } from 'src/database/schema';

export class saveScenarioLearningsCallbackDto {
  @IsNumber()
  job_id: typeof jobsTable.$inferSelect.id;

  @IsIn(['pending', 'failed', 'done'])
  job_status: typeof jobsTable.$inferSelect.status;
}
