import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  NotFoundException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MselService } from './msel.service';
import {
  ErrorUploadResponse,
  SelectMselDto,
  SuccessUploadResponse,
  UploadMselDto,
} from './msel.dto';

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
  async getMselsByProject(
    @Param('project_id', ParseIntPipe) project_id: number,
  ): Promise<SelectMselDto[]> {
    return await this.mselService.getMselsByProject(project_id);
  }

  @Post('upload')
  async uploadMsel(
    @Body() uploadMselDto: UploadMselDto,
  ): Promise<SuccessUploadResponse | ErrorUploadResponse> {
    return await this.mselService.fileParser(
      uploadMselDto.project_id,
      uploadMselDto.file_key,
    );
  }
}
