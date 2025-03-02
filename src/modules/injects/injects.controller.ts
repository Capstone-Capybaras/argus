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
import { InjectsService } from './injects.service';
import { CreateInjectDto } from './dto/create-inject.dto';
import { UpdateInjectDto } from './dto/update-inject.dto';
import { SelectInjectDto } from './dto/select-inject.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GenerateMselDto } from './dto/generate-msel.dto';
import { SelectJobDto } from '../jobs/dto/select-job.dto';
import { GenerateMselCallbackDto } from './dto/generate-msel-callback.dto';

@ApiBearerAuth()
@Controller('injects')
export class InjectsController {
  constructor(private readonly injectsService: InjectsService) {}

  // Create a new inject
  @Post()
  async createInject(
    @Body() createInjectDto: CreateInjectDto,
  ): Promise<SelectInjectDto> {
    try {
      const newInject = await this.injectsService.createInject(createInjectDto);
      return newInject;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to create inject: ${error}`);
    }
  }

  // Retrieve all injects
  @Get()
  async getInjects(): Promise<SelectInjectDto[]> {
    try {
      return await this.injectsService.getInjects();
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Get('project/:project_id')
  async getInjectsByProject(
    @Param('project_id') project_id: number,
  ): Promise<SelectInjectDto[]> {
    try {
      return await this.injectsService.getInjectsByProjectId(project_id);
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  // Retrieve a specific inject by ID
  @Get(':id')
  async getInjectById(@Param('id') id: string): Promise<SelectInjectDto> {
    try {
      const inject = await this.injectsService.getInjectByName(id);
      if (!inject) {
        throw new HttpException('Inject not found', HttpStatus.NOT_FOUND);
      }
      return inject;
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  // Update a specific inject by ID
  @Patch()
  async updateInject(
    @Body() updateInjectDto: UpdateInjectDto,
  ): Promise<SelectInjectDto> {
    try {
      const updatedInject = await this.injectsService.updateInject(
        updateInjectDto.inject_id,
        updateInjectDto,
      );
      if (!updatedInject) {
        throw new HttpException('Inject not found', HttpStatus.NOT_FOUND);
      }
      return updatedInject;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to update inject ${error}`);
    }
  }

  // Delete a specific inject by ID
  @Delete(':id')
  async deleteInject(@Param('id') id: string) {
    const deletedInject = await this.injectsService.deleteInject(id);
    if (!deletedInject) {
      throw new HttpException('Inject not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }

  @Post('/generate')
  async generateMsel(
    @Body() generateMselDto: GenerateMselDto,
  ): Promise<SelectJobDto> {
    try {
      return await this.injectsService.generateMsel(generateMselDto);
    } catch (e) {
      throw new BadRequestException('Failed to generate scenario: ', String(e));
    }
  }

  @Post('/generate/callback')
  async generateScenarioCallback(
    @Body() generateScenarioCallbackDto: GenerateMselCallbackDto,
  ) {
    try {
      return await this.injectsService.generateMselCallback(
        generateScenarioCallbackDto,
      );
    } catch (e) {
      throw new BadRequestException('Failed to callback msel: ', String(e));
    }
  }
}
