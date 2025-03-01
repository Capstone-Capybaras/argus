import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ThreatLandscapeService } from './threat-landscape.service';
import { CreateThreatLandscapeDto } from './dto/create-threat-landscape.dto';
import { UpdateThreatLandscapeDto } from './dto/update-threat-landscape.dto';
import { SelectThreatLandscapeDto } from './dto/select-threat-landscape.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GenerateThreatDto } from './dto/generate-threat.dto';
import { SelectJobDto } from '../jobs/dto/select-job.dto';
import { SelectThreatFileDto } from './dto/select-threat-file.dto';

@ApiBearerAuth()
@Controller('threat-landscape')
export class ThreatLandscapeController {
  constructor(
    private readonly threatLandscapeService: ThreatLandscapeService,
  ) {}

  @Post()
  async createThreatLandscape(
    @Body() createThreatLandscapeDto: CreateThreatLandscapeDto,
  ): Promise<SelectThreatLandscapeDto> {
    try {
      const threatLandscape =
        await this.threatLandscapeService.createThreatLandscape(
          createThreatLandscapeDto,
        );
      return threatLandscape;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        `Failed to create threat landscape ${error}`,
      );
    }
  }

  @Post('generate')
  async generateThreatLandscape(
    @Body() generateThreatDto: GenerateThreatDto,
  ): Promise<SelectJobDto> {
    try {
      const generateThreatJob =
        await this.threatLandscapeService.generateThreatLandscape(
          generateThreatDto,
        );
      return generateThreatJob;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        `Failed to generate threat landscape ${error}`,
      );
    }
  }

  @Get('threat-actors')
  async getAllThreatLandscapes(
    @Query('entity_id', ParseIntPipe) entity_id: number,
    @Query('file_key') file_key: string,
  ): Promise<SelectThreatLandscapeDto[]> {
    try {
      const threatLandscapes =
        await this.threatLandscapeService.getThreatLandscapeByEntityIdAndFile(
          entity_id,
          file_key,
        );
      return threatLandscapes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        `Failed to fetch threat landscapes ${error}`,
      );
    }
  }

  @Get('threat-actors-latest')
  async getLatestThreatLandscapes(
    @Query('entity_id', ParseIntPipe) entity_id: number,
  ): Promise<SelectThreatLandscapeDto[]> {
    try {
      const threatLandscapes =
        await this.threatLandscapeService.getLatestThreatLandscape(entity_id);
      return threatLandscapes ?? [];
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        `Failed to fetch threat landscapes ${error}`,
      );
    }
  }

  @Get('uploaded-files')
  async getFiles(
    @Query('entity_id', ParseIntPipe) entity_id: number,
  ): Promise<SelectThreatFileDto[]> {
    try {
      const threatFiles =
        await this.threatLandscapeService.getUploadHistory(entity_id);
      return threatFiles ?? [];
    } catch (error) {
      console.log(`Error Getting uploaded files: ${error}`);
      throw new BadRequestException(
        `Failed to fetch threat landscapes ${error}`,
      );
    }
  }

  @Patch()
  async updateThreatLandscape(
    @Body() updateThreatLandscapeDto: UpdateThreatLandscapeDto,
  ): Promise<SelectThreatLandscapeDto> {
    try {
      const updatedThreatLandscape =
        await this.threatLandscapeService.updateThreatLandscape(
          updateThreatLandscapeDto,
        );
      if (!updatedThreatLandscape) {
        throw new HttpException(
          'Threat landscape not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedThreatLandscape;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        `Failed to update threat landscape ${error}`,
      );
    }
  }
}
