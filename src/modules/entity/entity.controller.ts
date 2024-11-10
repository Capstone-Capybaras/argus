import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';

@Controller('entities')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  // Create a new entity
  @Post()
  async createEntity(@Body() createEntityDto: CreateEntityDto) {
    try {
      const newEntity = await this.entityService.createEntity(createEntityDto);
      return { message: 'Entity created successfully', data: newEntity };
    } catch (error) {
      throw new HttpException(
        'Failed to create entity',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Retrieve all entities
  @Get()
  async getEntities() {
    return await this.entityService.getEntities();
  }

  // Retrieve a specific entity by name
  @Get(':name')
  async getEntityByName(@Param('name') name: string) {
    const entity = await this.entityService.getEntityByName(name);
    if (!entity) {
      throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
    }
    return entity;
  }

  // Update an entity by name
  @Put(':name')
  async updateEntity(
    @Param('name') name: string,
    @Body() updateEntityDto: UpdateEntityDto,
  ) {
    try {
      const updatedEntity = await this.entityService.updateEntity(
        name,
        updateEntityDto,
      );
      if (!updatedEntity) {
        throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Entity updated successfully', data: updatedEntity };
    } catch (error) {
      throw new HttpException(
        'Failed to update entity',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Delete an entity by name
  @Delete(':name')
  async deleteEntity(@Param('name') name: string) {
    const deleted = await this.entityService.deleteEntity(name);
    if (!deleted) {
      throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Entity deleted successfully' };
  }
}
