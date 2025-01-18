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
import { CiiToScenarioService } from './cii-to-scenario.service';
import { CreateCIIScenarioDto } from './dto/create-cii-scenario.dto';
import { UpdateCIIScenarioDto } from './dto/update-cii-scenario.dto';

@Controller('cii-to-scenario')
export class CiiToScenarioController {
  constructor(private readonly ciiToScenarioService: CiiToScenarioService) {}

  // Create a new CII to Scenario mapping
  @Post()
  async createCIIScenario(@Body() createCIIScenarioDto: CreateCIIScenarioDto) {
    try {
      const ciiToScenario =
        await this.ciiToScenarioService.createCIIScenario(createCIIScenarioDto);
      return ciiToScenario;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create CII to Scenario mapping');
    }
  }

  // Get all CII to Scenario mappings
  @Get()
  async getAllCIIScenario() {
    try {
      const ciiToScenarios =
        await this.ciiToScenarioService.getAllCIIScenario();
      return ciiToScenarios;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch CII to Scenario mappings');
    }
  }

  // Get a CII to Scenario mapping by ID
  @Get(':id')
  async getCIIScenarioById(@Param('id') id: number) {
    try {
      const ciiToScenario =
        await this.ciiToScenarioService.getCIIScenarioById(id);
      if (!ciiToScenario) {
        throw new HttpException(
          'CII to Scenario mapping not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return ciiToScenario;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch CII to Scenario mapping');
    }
  }

  // Update a CII to Scenario mapping by ID
  @Patch(':id')
  async updateCIIScenario(
    @Param('id') id: number,
    @Body() updateCIIScenarioDto: UpdateCIIScenarioDto,
  ) {
    try {
      const updatedCIIScenario =
        await this.ciiToScenarioService.updateCIIScenario(updateCIIScenarioDto);
      if (!updatedCIIScenario) {
        throw new HttpException(
          'CII to Scenario mapping not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedCIIScenario;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update CII to Scenario mapping');
    }
  }

  // Delete a CII to Scenario mapping by ID
  @Delete(':id')
  async deleteCIIScenario(@Param('id') id: number) {
    const deleted = await this.ciiToScenarioService.deleteCIIScenario(id);
    if (!deleted) {
      throw new HttpException(
        'CII to Scenario mapping not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return true;
  }
}
