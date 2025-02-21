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
import { ScenarioService } from './scenario.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import {
  SelectScenarioDto,
  SelectScenarioWithAssetDto,
  SelectScenarioWithTtpDto,
} from './dto/select-scenario.dto';
import { GenerateScenarioDto } from './dto/generate-scenario.dto';
import { GenerateScenarioCallbackDto } from './dto/generate-scenario-callback.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('scenarios')
export class ScenarioController {
  constructor(private readonly scenarioService: ScenarioService) {}

  // Create a new scenario
  @Post()
  async createScenario(
    @Body() createScenarioDto: CreateScenarioDto,
  ): Promise<SelectScenarioDto> {
    try {
      const newScenario =
        await this.scenarioService.createScenario(createScenarioDto);
      return newScenario;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create scenario');
    }
  }

  @Post('/generate')
  async generateScenario(@Body() generateScenarioDto: GenerateScenarioDto) {
    try {
      return await this.scenarioService.generateScenario(generateScenarioDto);
    } catch (e) {
      throw new BadRequestException('Failed to generate scenario: ', String(e));
    }
  }

  @Post('/generate/callback')
  async generateScenarioCallback(
    @Body() generateScenarioCallbackDto: GenerateScenarioCallbackDto,
  ) {
    try {
      return await this.scenarioService.generateScenarioCallback(
        generateScenarioCallbackDto,
      );
    } catch (e) {
      throw new BadRequestException('Failed to generate scenario: ', String(e));
    }
  }

  @Get()
  async getScenarios(): Promise<SelectScenarioDto[]> {
    return await this.scenarioService.getScenarios();
  }

  @Get(':scenario_number')
  async getScenarioByNumber(
    @Param('scenario_number') scenario_number: string,
  ): Promise<SelectScenarioWithTtpDto> {
    const scenario =
      await this.scenarioService.getScenarioByNumber(scenario_number);
    if (!scenario) {
      throw new HttpException('Scenario not found', HttpStatus.NOT_FOUND);
    }
    return scenario;
  }

  @Get('project/:project_id')
  async getScenariosByProject(
    @Param('project_id') project_id: number,
  ): Promise<SelectScenarioWithAssetDto[]> {
    const scenarios =
      await this.scenarioService.getScenariosByProject(project_id);
    if (!scenarios) {
      throw new HttpException(
        'No scenarios found for this project',
        HttpStatus.NOT_FOUND,
      );
    }
    return scenarios;
  }

  // Update a scenario by scenario_number
  @Patch()
  async updateScenario(
    @Body() updateScenarioDto: UpdateScenarioDto,
  ): Promise<SelectScenarioDto> {
    try {
      const updatedScenario = await this.scenarioService.updateScenario(
        updateScenarioDto.scenario_number,
        updateScenarioDto,
      );
      if (!updatedScenario) {
        throw new HttpException('Scenario not found', HttpStatus.NOT_FOUND);
      }
      return updatedScenario;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update scenario');
    }
  }

  // Delete a scenario by scenario_number
  @Delete(':scenario_number')
  async deleteScenario(@Param('scenario_number') scenario_number: string) {
    const deleted = await this.scenarioService.deleteScenario(scenario_number);
    if (!deleted) {
      throw new HttpException('Scenario not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
