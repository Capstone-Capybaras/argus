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
} from '@nestjs/common';
import { ThreatLandscapeService } from './threat-landscape.service';
import { CreateThreatLandscapeDto } from './dto/create-threat-landscape.dto';
import { UpdateThreatLandscapeDto } from './dto/update-threat-landscape.dto';
import { SelectThreatLandscapeDto } from './dto/select-threat-landscape.dto';

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
      throw new BadRequestException('Failed to create threat landscape');
    }
  }

  @Get()
  async getAllThreatLandscapes(
    @Query('entity_id') entity_id: number,
  ): Promise<SelectThreatLandscapeDto[]> {
    try {
      const threatLandscapes = Number.isInteger(entity_id)
        ? await this.threatLandscapeService.getThreatLandscapeByEntityId(
            entity_id,
          )
        : await this.threatLandscapeService.getAllThreatLandscape();
      return threatLandscapes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch threat landscapes');
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
      throw new BadRequestException('Failed to update threat landscape');
    }
  }
}
