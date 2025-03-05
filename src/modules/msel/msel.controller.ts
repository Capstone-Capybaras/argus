import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { MselService } from './msel.service';
import { UploadMselDto } from './msel.dto';

@Controller('msel')
export class MselController {
  constructor(private readonly mselService: MselService) {}

  @Get('download')
  async downloadMsel(@Query('key') key: string): Promise<StreamableFile> {
    const fileStream = await this.mselService.downloadMsel(key);
    if (!fileStream) {
      throw new NotFoundException('File not found');
    }
    return fileStream;
  }

  @Get(':project_id')
  async getMselsByProject(@Param('project_id') project_id: number) {
    return await this.mselService.getMselsByProject(project_id);
  }

  @Post('upload')
  async uploadMsel(@Body() uploadMselDto: UploadMselDto) {
    return await this.mselService.fileParser(
      uploadMselDto.project_id,
      uploadMselDto.file_key,
    );
  }
}
