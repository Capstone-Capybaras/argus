import { Body, Controller, Post } from '@nestjs/common';
import { BatchScheduleService } from './batch-schedule.service';

@Controller('batch-schedule')
export class BatchScheduleController {
  constructor(private readonly batchScheduleService: BatchScheduleService) {}

  @Post('test')
  async testingFunc(
    @Body() projectID: number,
    attachments: string[],
    filePath: string,
  ) {
    const resp = await this.batchScheduleService.processExcel(
      projectID,
      attachments,
      filePath,
    );
    return resp;
  }
}
