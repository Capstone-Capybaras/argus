import { Controller, Get } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { SelectJobDto } from './dto/select-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getJobs(): Promise<SelectJobDto[]> {
    return this.jobsService.getPendingAndFailedJobs();
  }

  // TODO: delete route for job for FE
}
