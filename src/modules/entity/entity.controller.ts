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
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { SelectEntityDto } from './dto/select-entity.dto';

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

  // Retrieve all entities
  @Get()
  async getEntities(): Promise<SelectEntityDto[]> {
    return await this.entityService.getEntities();
  }

  // Retrieve a specific entity by name
  @Get(':name')
  async getEntityByName(@Param('name') name: string): Promise<SelectEntityDto> {
    const entity = await this.entityService.getEntityByName(name);
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
