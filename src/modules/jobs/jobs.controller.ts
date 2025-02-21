import { Controller, Delete, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { SelectJobDto } from './dto/select-job.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getJobs(): Promise<SelectJobDto[]> {
    return this.jobsService.getPendingAndFailedJobs();
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: number): Promise<boolean> {
    return this.jobsService.deleteJob(id);
  }
}
