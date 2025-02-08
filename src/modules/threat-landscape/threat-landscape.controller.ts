import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ThreatLandscapeService } from './threat-landscape.service';
import { CreateThreatLandscapeDto } from './dto/create-threat-landscape.dto';
import { UpdateThreatLandscapeDto } from './dto/update-threat-landscape.dto';

@Controller('threat-landscape')
export class ThreatLandscapeController {
  constructor(
    private readonly threatLandscapeService: ThreatLandscapeService,
  ) {}

  @Post()
  async createThreatLandscape(
    @Body() createThreatLandscapeDto: CreateThreatLandscapeDto,
  ) {
    try {
      const threatLandscape =
        await this.threatLandscapeService.createThreatLandscape(
          createThreatLandscapeDto,
        );
      return threatLandscape;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create threat landscape');
    }
  }

  @Get()
  async getAllThreatLandscape() {
    try {
      const threatLandscape =
        await this.threatLandscapeService.getAllThreatLandscape();
      return threatLandscape;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch threat landscapes');
    }
  }

  @Get(':id')
  async getThreatLandscapeById(@Param('id') id: number) {
    try {
      const threatLandscape =
        await this.threatLandscapeService.getThreatLandscapeById(id);
      if (!threatLandscape) {
        throw new HttpException(
          'Threat landscape not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return threatLandscape;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch threat landscape');
    }
  }

  @Patch(':id')
  async updateThreatLandscape(
    @Param('id') id: number,
    @Body() updateThreatLandscapeDto: UpdateThreatLandscapeDto,
  ) {
    try {
      const updatedThreatLandscape =
        await this.threatLandscapeService.updateThreatLandscape(
          id,
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
      throw new BadRequestException('Failed to update threat landscape');
    }
  }
}
