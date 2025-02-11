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
import { MasterThreatCubesService } from './master-threat-cubes.service';
import { CreateMasterThreatCubeDto } from './dto/create-master-threat.dto';
import { UpdateMasterThreatCubeDto } from './dto/update-master-threat.dto';

@Controller('master-threat-cubes')
export class MasterThreatCubesController {
  constructor(
    private readonly masterThreatCubesService: MasterThreatCubesService,
  ) {}

  @Post()
  async createMasterThreatCube(
    @Body() createMasterThreatCubeDto: CreateMasterThreatCubeDto,
  ) {
    try {
      const masterThreatCube =
        await this.masterThreatCubesService.createMasterThreatCube(
          createMasterThreatCubeDto,
        );
      return masterThreatCube;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create master threat cube');
    }
  }

  @Get()
  async getAllMasterThreatCubes() {
    try {
      const masterThreatCubes =
        await this.masterThreatCubesService.getAllMasterThreatCubes();
      return masterThreatCubes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch master threat cubes');
    }
  }

  @Get(':id')
  async getMasterThreatCubeById(@Param('id') id: number) {
    try {
      const masterThreatCube =
        await this.masterThreatCubesService.getMasterThreatCubeById(id);
      if (!masterThreatCube) {
        throw new HttpException(
          'Master threat cube not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return masterThreatCube;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch master threat cube');
    }
  }

  @Patch()
  async updateMasterThreatCube(
    @Body() updateMasterThreatCubeDto: UpdateMasterThreatCubeDto,
  ) {
    try {
      const updatedMasterThreatCube =
        await this.masterThreatCubesService.updateMasterThreatCube(
          updateMasterThreatCubeDto.id,
          updateMasterThreatCubeDto,
        );
      if (!updatedMasterThreatCube) {
        throw new HttpException(
          'Master threat cube not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedMasterThreatCube;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update master threat cube');
    }
  }

  @Delete(':id')
  async deleteMasterThreatCube(@Param('id') id: number) {
    const deleted =
      await this.masterThreatCubesService.deleteMasterThreatCube(id);
    if (!deleted) {
      throw new HttpException(
        'Master threat cube not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return true;
  }
}
