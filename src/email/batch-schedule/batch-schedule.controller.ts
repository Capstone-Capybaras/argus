import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Get('removeFile')
  async removeUploadedFile(@Query('fileKey') fileKey: string) {
    const res = await this.batchScheduleService.removeFile(fileKey);
    return res;
  }

  @Get('getFiles')
  async getFiles(@Query('project_id') project_id: number) {
    const files = await this.batchScheduleService.getUploaded(project_id);
    return files;
  }
}
