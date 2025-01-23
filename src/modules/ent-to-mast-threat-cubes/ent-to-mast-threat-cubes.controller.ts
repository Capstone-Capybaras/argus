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
import { EntToMastThreatCubesService } from './ent-to-mast-threat-cubes.service';
import { CreateEntToMasterThreatCubes } from './dto/create-ent-to-mast.dto';
import { UpdateEntToMasterThreatCubes } from './dto/update-ent-to-mast.dto';

@Controller('ent-to-mast-threat-cubes')
export class EntToMastThreatCubesController {
  constructor(
    private readonly entToMastThreatCubesService: EntToMastThreatCubesService,
  ) {}

  @Post()
  async createEntToMastThreatCube(
    @Body() createEntToMastThreatCubes: CreateEntToMasterThreatCubes,
  ) {
    try {
      const createdEntToMastThreatCube =
        await this.entToMastThreatCubesService.createEntToMastThreatCube(
          createEntToMastThreatCubes,
        );
      return createdEntToMastThreatCube;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create EntToMastThreatCube');
    }
  }

  @Get()
  async getAllEntToMastThreatCubes() {
    try {
      const entToMastThreatCubes =
        await this.entToMastThreatCubesService.getAllEntToMastThreatCubes();
      return entToMastThreatCubes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch EntToMastThreatCubes');
    }
  }

  @Get(':entity_id')
  async getEntToMastThreatCubesById(@Param('entity_id') entity_id: number) {
    try {
      const entToMastThreatCubes =
        await this.entToMastThreatCubesService.getEntToMastThreatCubesById(
          entity_id,
        );
      if (!entToMastThreatCubes) {
        throw new HttpException(
          'EntToMastThreatCubes not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return entToMastThreatCubes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch EntToMastThreatCubes');
    }
  }

  @Patch(':entity_id')
  async updateEntToMastThreatCubes(
    @Param('entity_id') entity_id: number,
    @Body() updateEntToMastThreatCubes: UpdateEntToMasterThreatCubes,
  ) {
    try {
      const updatedEntToMastThreatCubes =
        await this.entToMastThreatCubesService.updateEntToMastThreatCubes(
          entity_id,
          updateEntToMastThreatCubes,
        );
      if (!updatedEntToMastThreatCubes) {
        throw new HttpException(
          'EntToMastThreatCubes not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedEntToMastThreatCubes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update EntToMastThreatCubes');
    }
  }

  @Delete(':entity_id')
  async deleteEntToMastThreatCubes(@Param('entity_id') entity_id: number) {
    const deleted =
      await this.entToMastThreatCubesService.deleteEntToMastThreatCubes(
        entity_id,
      );
    if (!deleted) {
      throw new HttpException(
        'EntToMastThreatCubes not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return true;
  }
}
