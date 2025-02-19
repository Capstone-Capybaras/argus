import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { CreateJobDto } from './dto/create-job.dto';
import { jobsTable } from 'src/database/schema';

@Injectable()
export class JobsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createJob(data: CreateJobDto) {
    const [result] = await this.db.insert(jobsTable).values(data).returning();
    return result;
  }
}
