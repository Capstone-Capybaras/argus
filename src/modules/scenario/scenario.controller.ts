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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import {
  SelectScenarioDto,
  SelectScenarioWithAssetDto,
  SelectScenarioByNumberDto,
} from './dto/select-scenario.dto';
import { GenerateScenarioDto } from './dto/generate-scenario.dto';
import { GenerateScenarioCallbackDto } from './dto/generate-scenario-callback.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SelectJobDto } from '../jobs/dto/select-job.dto';
import { UriDecodePipe } from 'src/utils/uriDecode.pipe';

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
      throw new BadRequestException(`Failed to create scenario: ${error}`);
    }
  }

  @Post('/generate')
  async generateScenario(
    @Body() generateScenarioDto: GenerateScenarioDto,
  ): Promise<SelectJobDto> {
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
      throw new BadRequestException('Failed to callback scenario: ', String(e));
    }
  }

  @Get()
  async getScenarios(): Promise<SelectScenarioDto[]> {
    try {
      return await this.scenarioService.getScenarios();
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Get(':scenario_number')
  async getScenarioByNumber(
    @Param('scenario_number', UriDecodePipe) scenario_number: string,
    @Query('project_id', ParseIntPipe) project_id: number,
  ): Promise<SelectScenarioByNumberDto> {
    try {
      const scenario = await this.scenarioService.getScenarioByNumber(
        scenario_number,
        project_id,
      );
      if (!scenario) {
        throw new HttpException('Scenario not found', HttpStatus.NOT_FOUND);
      }
      return scenario;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get('project/:project_id')
  async getScenariosByProject(
    @Param('project_id', ParseIntPipe) project_id: number,
  ): Promise<SelectScenarioWithAssetDto[]> {
    try {
      const scenarios =
        await this.scenarioService.getScenariosByProject(project_id);
      if (!scenarios) {
        throw new HttpException(
          'No scenarios found for this project',
          HttpStatus.NOT_FOUND,
        );
      }
      return scenarios;
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  // Update a scenario by scenario_number
  @Patch()
  async updateScenario(
    @Body() updateScenarioDto: UpdateScenarioDto,
  ): Promise<SelectScenarioDto> {
    try {
      const updatedScenario = await this.scenarioService.updateScenario(
        updateScenarioDto.project_id,
        updateScenarioDto.scenario_number,
        updateScenarioDto,
      );
      if (!updatedScenario) {
        throw new HttpException('Scenario not found', HttpStatus.NOT_FOUND);
      }
      return updatedScenario;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to update scenario ${error}`);
    }
  }

  // Delete a scenario by scenario_number
  @Delete()
  async deleteScenario(
    @Query('scenario_number', UriDecodePipe) scenario_number: string,
    @Query('project_id', ParseIntPipe) project_id: number,
  ) {
    const deleted = await this.scenarioService.deleteScenario(
      scenario_number,
      project_id,
    );
    if (!deleted) {
      throw new HttpException('Scenario not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
