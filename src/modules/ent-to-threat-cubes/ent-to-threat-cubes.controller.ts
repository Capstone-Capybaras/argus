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
import { CreateEntToThreatDto } from './dto/create-ent-to-threat.dto';
import { UpdateEntToThreatDto } from './dto/update-ent-to-threat.dto';
import { EntToThreatCubesService } from './ent-to-threat-cubes.service';

@Controller('ent-to-threat-cubes')
export class EntToThreatCubesController {
  constructor(
    private readonly entToThreatCubesService: EntToThreatCubesService,
  ) {}

  @Post()
  async createEntToThreatCubes(
    @Body() createEntToThreatDto: CreateEntToThreatDto,
  ) {
    try {
      const createdEntToThreatCubes =
        await this.entToThreatCubesService.createEntToThreat(
          createEntToThreatDto,
        );
      return createdEntToThreatCubes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create ent-to-threat-cubes');
    }
  }

  @Get()
  async getAllEntToThreatCubes() {
    try {
      const entToThreatCubes =
        await this.entToThreatCubesService.getAllEntToThreat();
      return entToThreatCubes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch ent-to-threat-cubes');
    }
  }

  @Get(':entity_id')
  async getEntToThreatCubesById(@Param('entity_id') entity_id: number) {
    try {
      const entToThreatCubes =
        await this.entToThreatCubesService.getEntToThreatById(entity_id);
      if (!entToThreatCubes) {
        throw new HttpException(
          'Ent-to-threat-cubes not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return entToThreatCubes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch ent-to-threat-cubes');
    }
  }

  @Patch(':entity_id')
  async updateEntToThreatCubes(
    @Param('entity_id') entity_id: number,
    @Body() updateEntToThreatDto: UpdateEntToThreatDto,
  ) {
    try {
      const updatedEntToThreatCubes =
        await this.entToThreatCubesService.updateEntToThreat(
          entity_id,
          updateEntToThreatDto,
        );
      if (!updatedEntToThreatCubes) {
        throw new HttpException(
          'Ent-to-threat-cubes not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedEntToThreatCubes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update ent-to-threat-cubes');
    }
  }

  @Delete(':entity_id')
  async deleteEntToThreatCubes(@Param('entity_id') entity_id: number) {
    const deleted =
      await this.entToThreatCubesService.deleteEntToThreat(entity_id);
    if (!deleted) {
      throw new HttpException(
        'Ent-to-threat-cubes not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return true;
  }
}
