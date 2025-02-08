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
import { TtpUsedService } from './ttp-used.service';
import { CreateTtpUsedDto } from './dto/create-ttp-used.dto';
import { UpdateTtpUsedDto } from './dto/update-ttp-used.dto';

@Controller('ttp-used')
export class TtpUsedController {
  constructor(private readonly ttpUsedService: TtpUsedService) {}

  @Post()
  async createTtpUsed(@Body() createTtpUsedDto: CreateTtpUsedDto) {
    try {
      const createdTtpUsed =
        await this.ttpUsedService.createTtpUsed(createTtpUsedDto);
      return createdTtpUsed;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create TTP used');
    }
  }

  @Get()
  async getAllTtpUsed() {
    try {
      const ttpUsedList = await this.ttpUsedService.getAllTtpUsed();
      return ttpUsedList;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch TTP used list');
    }
  }

  @Get(':id')
  async getTtpUsedById(@Param('id') id: number) {
    try {
      const ttpUsed = await this.ttpUsedService.getTtpUsedById(id);
      if (!ttpUsed) {
        throw new HttpException('TTP used not found', HttpStatus.NOT_FOUND);
      }
      return ttpUsed;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch TTP used');
    }
  }

  @Patch(':id')
  async updateTtpUsed(
    @Param('id') id: number,
    @Body() updateTtpUsedDto: UpdateTtpUsedDto,
  ) {
    try {
      const updatedTtpUsed = await this.ttpUsedService.updateTtpUsed(
        id,
        updateTtpUsedDto,
      );
      if (!updatedTtpUsed) {
        throw new HttpException('TTP used not found', HttpStatus.NOT_FOUND);
      }
      return updatedTtpUsed;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update TTP used');
    }
  }

  @Delete(':id')
  async deleteTtpUsed(@Param('id') id: number) {
    const deleted = await this.ttpUsedService.deleteTtpUsed(id);
    if (!deleted) {
      throw new HttpException('TTP used not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
