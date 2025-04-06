import { ApiProperty } from '@nestjs/swagger';
import { jobsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectJobDto implements InferSelect<typeof jobsTable> {
  id: number;

  @ApiProperty({ enum: ['scenario', 'msel', 'threat', 'learning'] })
  type: 'scenario' | 'msel' | 'threat' | 'learning';

  @ApiProperty({ enum: ['pending', 'failed', 'done'] })
  status: 'pending' | 'failed' | 'done';

  created_at: Date;
  name: string;
  project_id: number;
}
