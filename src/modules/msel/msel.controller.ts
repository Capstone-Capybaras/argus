import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { MselService } from './msel.service';
import { Response } from 'express';
import { UploadMselDto } from './msel.dto';

@Controller('msel')
export class MselController {
  constructor(private readonly mselService: MselService) {}

  @Get(':project_id')
  async getMselsByProject(@Param('project_id') project_id: number) {
    return await this.mselService.getMselsByProject(project_id);
  }

  @Get('download/:key')
  async downloadMsel(@Param('key') key: string, @Res() res: Response) {
    return await this.mselService.downloadMsel(key, res);
  }

  @Post('upload')
  async uploadMsel(@Body() uploadMselDto: UploadMselDto) {
    return await this.mselService.uploadMsel(uploadMselDto);
  }
}
