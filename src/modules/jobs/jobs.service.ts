import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { CreateJobDto } from './dto/create-job.dto';
import { jobsTable } from 'src/database/schema';
import { SelectJobDto } from './dto/select-job.dto';
import { and, eq, ne } from 'drizzle-orm';
import { UpdateJobDto } from './dto/update-job.dto';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class JobsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createJob(data: CreateJobDto) {
    const [result] = await this.db.insert(jobsTable).values(data).returning();
    return result;
  }

  async getPendingAndFailedJobs(projectId: number): Promise<SelectJobDto[]> {
    return this.db
      .select()
      .from(jobsTable)
      .where(
        and(ne(jobsTable.status, 'done'), eq(jobsTable.project_id, projectId)),
      );
  }

  async updateJob(data: UpdateJobDto): Promise<SelectJobDto> {
    const [result] = await this.db
      .update(jobsTable)
      .set(data)
      .where(eq(jobsTable.id, data.id))
      .returning();
    return result;
  }

  async deleteJob(id: number) {
    const results = await this.db
      .delete(jobsTable)
      .where(eq(jobsTable.id, id))
      .returning();

    return results.length > 0;
  }

  async onJobFailed(id: number) {
    await this.updateJob({
      id,
      status: 'failed',
    });

    this.eventsGateway.onJobFailed({
      jobId: id,
    });
  }
}
