import { Body, Controller, Post } from '@nestjs/common';
import { BatchScheduleService } from './batch-schedule.service';
import { BatchUploadDto } from './batch-schedule.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('batch-schedule')
export class BatchScheduleController {
  constructor(private readonly batchScheduleService: BatchScheduleService) {}

  @Post('batchUpload')
  async batchUpload(@Body() batchUploadDto: BatchUploadDto) {
    const resp = await this.batchScheduleService.processExcel(
      batchUploadDto.projectId,
      batchUploadDto.attachments,
      batchUploadDto.templateFile,
    );
    return resp;
  }
}
