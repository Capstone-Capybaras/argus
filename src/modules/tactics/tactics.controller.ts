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
import { TacticsService } from './tactics.service';
import { CreateTacticsDto } from './dto/create-tactics.dto';
import { UpdateTacticsDto } from './dto/update-tactics.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('tactics')
export class TacticsController {
  constructor(private readonly tacticsService: TacticsService) {}

  @Post()
  async createTactic(@Body() createTacticsDto: CreateTacticsDto) {
    try {
      const tactic = await this.tacticsService.createTactic(createTacticsDto);
      return tactic;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to create tactic ${error}`);
    }
  }

  @Get()
  async getAllTactics() {
    try {
      const tactics = await this.tacticsService.getAllTactics();
      return tactics;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to fetch tactics ${error}`);
    }
  }

  @Get(':id')
  async getTacticById(@Param('id') id: string) {
    try {
      const tactic = await this.tacticsService.getTacticById(id);
      if (!tactic) {
        throw new HttpException('Tactic not found', HttpStatus.NOT_FOUND);
      }
      return tactic;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to fetch tactic ${error}`);
    }
  }

  @Patch(':id')
  async updateTactic(
    @Param('id') id: string,
    @Body() updateTacticsDto: UpdateTacticsDto,
  ) {
    try {
      const updatedTactic = await this.tacticsService.updateTactic(
        id,
        updateTacticsDto,
      );
      if (!updatedTactic) {
        throw new HttpException('Tactic not found', HttpStatus.NOT_FOUND);
      }
      return updatedTactic;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to update tactic ${error}`);
    }
  }

  @Delete(':id')
  async deleteTactic(@Param('id') id: string) {
    const deleted = await this.tacticsService.deleteTactic(id);
    if (!deleted) {
      throw new HttpException('Tactic not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
