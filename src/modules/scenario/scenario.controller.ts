import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';

@Controller('scenarios')
export class ScenarioController {
  constructor(private readonly scenarioService: ScenarioService) {}

  // Create a new scenario
  @Post()
  async createScenario(@Body() createScenarioDto: CreateScenarioDto) {
    try {
      const newScenario =
        await this.scenarioService.createScenario(createScenarioDto);
      return { message: 'Scenario created successfully', data: newScenario };
    } catch (error) {
      throw new HttpException(
        'Failed to create scenario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Retrieve all scenarios
  @Get()
  async getScenarios() {
    return await this.scenarioService.getScenarios();
  }

  // Retrieve a specific scenario by scenario_number
  @Get(':scenario_number')
  async getScenarioByNumber(@Param('scenario_number') scenario_number: string) {
    const scenario =
      await this.scenarioService.getScenarioByNumber(scenario_number);
    if (!scenario) {
      throw new HttpException('Scenario not found', HttpStatus.NOT_FOUND);
    }
    return scenario;
  }

  // Update a scenario by scenario_number
  @Patch(':scenario_number')
  async updateScenario(
    @Param('scenario_number') scenario_number: string,
    @Body() updateScenarioDto: UpdateScenarioDto,
  ) {
    try {
      const updatedScenario = await this.scenarioService.updateScenario(
        scenario_number,
        updateScenarioDto,
      );
      if (!updatedScenario) {
        throw new HttpException('Scenario not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Scenario updated successfully',
        data: updatedScenario,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to update scenario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Delete a scenario by scenario_number
  @Delete(':scenario_number')
  async deleteScenario(@Param('scenario_number') scenario_number: string) {
    const deleted = await this.scenarioService.deleteScenario(scenario_number);
    if (!deleted) {
      throw new HttpException('Scenario not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Scenario deleted successfully' };
  }
}
