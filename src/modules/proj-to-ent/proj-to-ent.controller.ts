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
import { ProjToEntService } from './proj-to-ent.service';
import { CreateProjectToEntityDto } from './dto/create-proj-ent.dto';
import { UpdateProjectToEntityDto } from './dto/update-proj-ent.dto';

@Controller('proj-to-ent')
export class ProjToEntController {
  constructor(private readonly projToEntService: ProjToEntService) {}

  @Post()
  async createProjectEntity(
    @Body() createProjectEntityDto: CreateProjectToEntityDto,
  ) {
    try {
      return await this.projToEntService.createProjectEntity(
        createProjectEntityDto,
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create project entity');
    }
  }

  @Get()
  async getAllProjEnt() {
    try {
      return await this.projToEntService.getAllProjectEntities();
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch project entities');
    }
  }

  @Get(':entity_id')
  async getProjEntById(@Param('entity_id') entity_id: number) {
    try {
      const projectEntity =
        await this.projToEntService.getProjectEntityById(entity_id);
      if (!projectEntity) {
        throw new HttpException(
          'Project entity not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return projectEntity;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch project entity');
    }
  }

  @Patch(':entity_id')
  async updateProjEnt(
    @Param('entity_id') entity_id: number,
    @Body() updateProjectEntityDto: UpdateProjectToEntityDto,
  ) {
    try {
      return await this.projToEntService.updateProjectEntity(
        entity_id,
        updateProjectEntityDto,
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update project entity');
    }
  }

  @Delete(':entity_id')
  async deleteProjEnt(@Param('entity_id') entity_id: number) {
    const deleted = await this.projToEntService.deleteProjectEntity(entity_id);
    if (!deleted) {
      throw new HttpException('Project entity not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
