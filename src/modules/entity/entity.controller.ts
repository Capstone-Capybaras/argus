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
  Query,
} from '@nestjs/common';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { SelectEntityDto } from './dto/select-entity.dto';
import { AssignEntityDto } from './dto/assign-entity.dto';

@Controller('entities')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  // Create a new entity
  @Post()
  async createEntity(
    @Body() createEntityDto: CreateEntityDto,
  ): Promise<SelectEntityDto> {
    try {
      return await this.entityService.createEntity(createEntityDto);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create entity');
    }
  }

  /**
   * This route is to assign an existing entity from global db and tag it to project
   */
  @Post('assign')
  async assignEntity(
    @Body() assignEntityDto: AssignEntityDto,
  ): Promise<boolean> {
    try {
      const insertResult =
        await this.entityService.assignEntityToProject(assignEntityDto);
      return !!insertResult;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create entity');
    }
  }

  // Retrieve all entities
  @Get()
  async getEntities(
    @Query('project_id') projectId: number,
  ): Promise<SelectEntityDto[]> {
    if (projectId) {
      return await this.entityService.getEntitiesByProjectId(projectId);
    }
    return await this.entityService.getEntities();
  }

  // Retrieve a specific entity by id
  @Get(':id')
  async getEntityById(@Param('id') id: number): Promise<SelectEntityDto> {
    const entity = await this.entityService.getEntityById(id);
    if (!entity) {
      throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
    }
    return entity;
  }

  // Update an entity by name
  @Patch(':name')
  async updateEntity(
    @Param('name') name: string,
    @Body() updateEntityDto: UpdateEntityDto,
  ): Promise<SelectEntityDto> {
    try {
      const updatedEntity = await this.entityService.updateEntity(
        name,
        updateEntityDto,
      );
      if (!updatedEntity) {
        throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
      }
      return updatedEntity;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update entity');
    }
  }

  // Delete an entity by name
  @Delete(':name')
  async deleteEntity(@Param('name') name: string) {
    const deleted = await this.entityService.deleteEntity(name);
    if (!deleted) {
      throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
