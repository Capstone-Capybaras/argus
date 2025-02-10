import { Controller, Get, Post, Patch, Delete, Body } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  async createParticipant(@Body() data: CreateParticipantDto) {
    return this.participantsService.createParticipant(data);
  }

  @Get()
  async getAllParticipants() {
    return this.participantsService.getAllParticipants();
  }

  @Get(':email')
  async getParticipantByEmail(email: string) {
    return this.participantsService.getParticipantByEmail(email);
  }

  @Patch(':email')
  async updateParticipant(email: string, @Body() data: UpdateParticipantDto) {
    return this.participantsService.updateParticipant(email, data);
  }

  @Delete(':email')
  async deleteParticipant(email: string) {
    return this.participantsService.deleteParticipant(email);
  }
}
