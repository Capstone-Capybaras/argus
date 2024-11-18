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
import { InjectsService } from './injects.service';
import { CreateInjectDto } from './dto/create-inject.dto';
import { UpdateInjectDto } from './dto/update-inject.dto';
import { SelectInjectDto } from './dto/select-inject.dto';

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
      throw new BadRequestException('Failed to create inject');
    }
  }

  // Retrieve all injects
  @Get()
  async getInjects(): Promise<SelectInjectDto[]> {
    return await this.injectsService.getInjects();
  }

  // Retrieve a specific inject by ID
  @Get(':id')
  async getInjectById(@Param('id') id: string): Promise<SelectInjectDto> {
    const inject = await this.injectsService.getInjectByName(id);
    if (!inject) {
      throw new HttpException('Inject not found', HttpStatus.NOT_FOUND);
    }
    return inject;
  }

  // Update a specific inject by ID
  @Patch(':id')
  async updateInject(
    @Param('id') id: string,
    @Body() updateInjectDto: UpdateInjectDto,
  ): Promise<SelectInjectDto> {
    try {
      const updatedInject = await this.injectsService.updateInject(
        id,
        updateInjectDto,
      );
      if (!updatedInject) {
        throw new HttpException('Inject not found', HttpStatus.NOT_FOUND);
      }
      return updatedInject;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update inject');
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
}
