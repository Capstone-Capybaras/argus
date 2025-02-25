import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  BadRequestException,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import {
  SelectParticipantDto,
  ParticipantWithRoles,
} from './dto/select-participant.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ParticipantsWithEntityAndRoles } from './dto/all-participants.dto';

@ApiBearerAuth()
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  async createParticipant(@Body() data: CreateParticipantDto): Promise<void> {
    try {
      return await this.participantsService.createParticipant(data);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get()
  async getAllParticipants(
    @Query('entity_id', ParseIntPipe) entityId: number,
  ): Promise<ParticipantWithRoles[]> {
    const p =
      await this.participantsService.getAllParticipantsByEntity(entityId);
    return p;
  }

  @Get('getAllParticipantsInProject')
  async getParticipantsByProject(
    @Query('project_id', ParseIntPipe) project_id: number,
  ): Promise<ParticipantsWithEntityAndRoles[]> {
    console.log('Received project_id:', project_id);
    if (isNaN(project_id)) {
      throw new BadRequestException(
        'Invalid project_id. It must be a numeric string.',
      );
    }
    const participants =
      await this.participantsService.getParticipantsByProject(project_id);
    if (participants) {
      return participants;
    } else {
      return [];
    }
  }

  @Get(':email')
  async getParticipantByEmail(
    @Query('entity_id', ParseIntPipe) entityId: number,
    @Param('email') email: string,
  ): Promise<ParticipantWithRoles | undefined> {
    return this.participantsService.getParticipantByEmailAndEntity(
      email,
      entityId,
    );
  }

  @Patch()
  async updateParticipant(
    @Body() data: UpdateParticipantDto,
  ): Promise<SelectParticipantDto> {
    return this.participantsService.updateParticipant(data.email, data);
  }

  @Delete()
  async deleteParticipant(
    @Query('entity_id', ParseIntPipe) entityId: number,
    @Query('email') email: string,
  ) {
    if (!Number.isInteger(entityId) || !email) {
      // need both fields to be supplied
      throw new BadRequestException(
        'Please supply both entity_id and email query parameters',
      );
    }
    return this.participantsService.deleteParticipantFromEntity(
      email,
      entityId,
    );
  }
}
