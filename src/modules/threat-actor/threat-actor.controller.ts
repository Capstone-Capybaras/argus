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
import { ThreatActorService } from './threat-actor.service';
import { CreateThreatActorDto } from './dto/create-threat-actor.dto';
import { UpdateThreatActorDto } from './dto/update-threat-actor.dto';

@Controller('threat-actor')
export class ThreatActorController {
  constructor(private readonly threatActorService: ThreatActorService) {}

  // Create a new threat actor
  @Post()
  async createThreatActor(@Body() createThreatActorDto: CreateThreatActorDto) {
    return this.threatActorService.createThreatActor(createThreatActorDto);
  }

  // Get all threat actors
  @Get()
  async getAllThreatActors() {
    return this.threatActorService.getAllThreatActors();
  }

  // Get a threat actor by ID
  @Get(':id')
  async getThreatActorById(@Param('id') id: number) {
    return this.threatActorService.getThreatActorById(id);
  }

  // Update a threat actor by ID
  @Patch(':id')
  async updateThreatActor(
    @Param('id') id: string,
    @Body() updateThreatActorDto: UpdateThreatActorDto,
  ) {
    return this.threatActorService.updateThreatActor(id, updateThreatActorDto);
  }

  // Delete a threat actor by ID
  @Delete(':id')
  async deleteThreatActor(@Param('id') id: number) {
    const deleted = await this.threatActorService.deleteThreatActor(id);
    if (!deleted) {
      throw new HttpException('Threat Actor not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
