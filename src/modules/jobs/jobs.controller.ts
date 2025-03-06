import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { SelectJobDto } from './dto/select-job.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getJobs(
    @Query('project_id', ParseIntPipe) projectId: number,
  ): Promise<SelectJobDto[]> {
    try {
      return await this.jobsService.getPendingAndFailedJobs(projectId);
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Delete(':id')
  async deleteJob(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    try {
      return await this.jobsService.deleteJob(id);
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
