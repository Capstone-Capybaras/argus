import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ProjToThreatActorService } from './proj-to-threat-actor.service';
import { CreateProjectToThreatActorDto } from './dto/create-proj-actor.dto';
import { UpdateProjectToThreatActorDto } from './dto/update-proj-actor.dto';

@Controller('proj-to-threat-actor')
export class ProjToThreatActorController {
  constructor(
    private readonly projToThreatActorService: ProjToThreatActorService,
  ) {}

  @Post()
  async create(
    @Body() createProjToThreatActorDto: CreateProjectToThreatActorDto,
  ) {
    try {
      return await this.projToThreatActorService.createProjectToThreatActor(
        createProjToThreatActorDto,
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.projToThreatActorService.getAllProjectToThreatActor();
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch all');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.projToThreatActorService.getProjectToThreatActorById(
        id,
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch specific id');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProjToThreatActorDto: UpdateProjectToThreatActorDto,
  ) {
    try {
      return await this.projToThreatActorService.updateProjectToThreatActor(
        id,
        updateProjToThreatActorDto,
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('failed to update');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.projToThreatActorService.deleteProjectToThreatActor(id);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('failed to delete');
    }
  }
}
