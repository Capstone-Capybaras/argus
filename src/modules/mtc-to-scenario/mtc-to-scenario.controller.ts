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
import { MtcToScenarioService } from './mtc-to-scenario.service';
import { CreateMasterThreatToScenarioDto } from './dto/create-mtc-scen.dto';
import { UpdateMasterThreatToScenarioDto } from './dto/update-mtc-scen.dto';

@Controller('mtc-to-scenario')
export class MtcToScenarioController {
  constructor(private readonly mtcToScenarioService: MtcToScenarioService) {}

  // Create a new MTC to Scenario mapping
  @Post()
  async createMtcToScenario(
    @Body() createMtcToScenarioDto: CreateMasterThreatToScenarioDto,
  ) {
    try {
      const newMtcToScenario =
        await this.mtcToScenarioService.createMasterThreatToScenario(
          createMtcToScenarioDto,
        );
      return newMtcToScenario;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create MTC to Scenario mapping');
    }
  }

  // Get all MTC to Scenario mappings
  @Get()
  async getAllMtcToScenario() {
    try {
      const mtcToScenarios =
        await this.mtcToScenarioService.getAllMasterThreatToScenario();
      return mtcToScenarios;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch MTC to Scenario mappings');
    }
  }

  // Get a MTC to Scenario mapping by ID
  @Get(':id')
  async getMtcToScenarioById(@Param('id') id: number) {
    try {
      const mtcToScenario =
        await this.mtcToScenarioService.getMasterThreatToScenarioById(id);
      if (!mtcToScenario) {
        throw new HttpException(
          'MTC to Scenario mapping not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return mtcToScenario;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch MTC to Scenario mapping');
    }
  }

  // Update a MTC to Scenario mapping by ID
  @Patch(':id')
  async updateMtcToScenario(
    @Param('id') id: string,
    @Body() updateMtcToScenarioDto: UpdateMasterThreatToScenarioDto,
  ) {
    try {
      const updatedMtcToScenario =
        await this.mtcToScenarioService.updateMasterThreatToScenario(
          id,
          updateMtcToScenarioDto,
        );
      if (!updatedMtcToScenario) {
        throw new HttpException(
          'MTC to Scenario mapping not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedMtcToScenario;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update MTC to Scenario mapping');
    }
  }

  // Delete a MTC to Scenario mapping by ID
  @Delete(':id')
  async deleteMtcToScenario(@Param('id') id: number) {
    const deleted =
      await this.mtcToScenarioService.deleteMasterThreatToScenario(id);
    if (!deleted) {
      throw new HttpException(
        'MTC to Scenario mapping not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return true;
  }
}
