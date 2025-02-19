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
    return this.participantsService.getAllParticipantsByEntity(entityId);
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

  @Delete(':entity_id/:email')
  async deleteParticipant(
    @Param('entity_id', ParseIntPipe) entityId: number,
    @Param('email') email: string,
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
