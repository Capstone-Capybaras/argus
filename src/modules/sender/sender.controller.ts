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
import { SenderService } from './sender.service';
import { CreateSenderDto } from './dto/create-sender.dto';
import { UpdateSenderDto } from './dto/update-sender.dto';

@Controller('sender')
export class SenderController {
  constructor(private readonly senderService: SenderService) {}
  @Post()
  async createSender(@Body() createSenderDto: CreateSenderDto) {
    try {
      const sender = await this.senderService.createSender(createSenderDto);
      return sender;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create sender');
    }
  }

  @Get()
  async getAllSenders() {
    try {
      const senders = await this.senderService.getAllSenders();
      return senders;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch senders');
    }
  }

  @Get(':project_id')
  async getSender(@Param('project_id') project_id: number) {
    try {
      const sender = await this.senderService.getSender(project_id);
      if (!sender) {
        throw new HttpException('Sender not found', HttpStatus.NOT_FOUND);
      }
      return sender;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch sender');
    }
  }

  @Patch(':project_id')
  async updateSender(
    @Param('project_id') project_id: number,
    @Body() updateSenderDto: UpdateSenderDto,
  ) {
    try {
      const sender = await this.senderService.updateSender(
        project_id,
        updateSenderDto,
      );
      return sender;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update sender');
    }
  }

  @Delete(':project_id')
  async deleteSender(@Param('project_id') project_id: number) {
    try {
      const sender = await this.senderService.deleteSender(project_id);
      return sender;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to delete sender');
    }
  }
}
