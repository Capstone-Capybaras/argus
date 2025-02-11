import { Controller, Get, Post, Patch, Delete, Body } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { SelectParticipantDto } from './dto/select-participant.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  async createParticipant(
    @Body() data: CreateParticipantDto,
  ): Promise<SelectParticipantDto> {
    return this.participantsService.createParticipant(data);
  }

  @Get()
  async getAllParticipants(): Promise<SelectParticipantDto[]> {
    return this.participantsService.getAllParticipants();
  }

  @Get(':email')
  async getParticipantByEmail(email: string): Promise<SelectParticipantDto> {
    return this.participantsService.getParticipantByEmail(email);
  }

  @Patch()
  async updateParticipant(
    @Body() data: UpdateParticipantDto,
  ): Promise<SelectParticipantDto> {
    return this.participantsService.updateParticipant(data.email, data);
  }

  @Delete(':email')
  async deleteParticipant(email: string) {
    return this.participantsService.deleteParticipant(email);
  }
}
