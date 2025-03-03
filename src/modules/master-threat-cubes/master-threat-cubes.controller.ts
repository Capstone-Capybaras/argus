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
  InternalServerErrorException,
} from '@nestjs/common';
import { MasterThreatCubesService } from './master-threat-cubes.service';
import {
  AddHeatMapDto,
  CreateMasterThreatCubeDto,
} from './dto/create-master-threat.dto';
import { UpdateMasterThreatCubeDto } from './dto/update-master-threat.dto';
import { SelectMasterThreatCubeDto } from './dto/select-master-threat.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('master-threat-cubes')
export class MasterThreatCubesController {
  constructor(
    private readonly masterThreatCubesService: MasterThreatCubesService,
  ) {}

  @Post()
  async createMasterThreatCube(
    @Body() createMasterThreatCubeDto: CreateMasterThreatCubeDto,
  ): Promise<SelectMasterThreatCubeDto> {
    try {
      const masterThreatCube =
        await this.masterThreatCubesService.createMasterThreatCube(
          createMasterThreatCubeDto,
        );
      return masterThreatCube;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        `Failed to create master threat cube ${error}`,
      );
    }
  }

  @Get()
  async getAllMasterThreatCubes(): Promise<SelectMasterThreatCubeDto[]> {
    try {
      const masterThreatCubes =
        await this.masterThreatCubesService.getAllMasterThreatCubes();
      return masterThreatCubes;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        `Failed to fetch master threat cubes ${error}`,
      );
    }
  }

  @Get('heatMap/:id')
  async getHeatmap(@Param('id') id: number) {
    const data = await this.masterThreatCubesService.getTTPsfromEntity(id);
    return data ?? [];
  }

  @Get(':id')
  async getMasterThreatCubeById(
    @Param('id') id: string,
  ): Promise<SelectMasterThreatCubeDto> {
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
      throw new BadRequestException(
        `Failed to fetch master threat cube ${error}`,
      );
    }
  }

  @Patch()
  async updateMasterThreatCube(
    @Body() updateMasterThreatCubeDto: UpdateMasterThreatCubeDto,
  ): Promise<SelectMasterThreatCubeDto> {
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
      throw new BadRequestException(
        `Failed to update master threat cube ${error}`,
      );
    }
  }

  @Delete(':id')
  async deleteMasterThreatCube(@Param('id') id: string) {
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

  @Post('heatMap')
  async addHeatMap(@Body() addheatmapdto: AddHeatMapDto) {
    try {
      await this.masterThreatCubesService.createHeatmap(
        addheatmapdto.entity_id,
        addheatmapdto.s3key,
      );
      const newTTPs = await this.masterThreatCubesService.getTTPsfromEntity(
        addheatmapdto.entity_id,
      );
      return newTTPs;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
