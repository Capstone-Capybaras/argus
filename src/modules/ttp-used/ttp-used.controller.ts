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
  Query,
} from '@nestjs/common';
import { TtpUsedService } from './ttp-used.service';
import { CreateTtpUsedDto } from './dto/create-ttp-used.dto';
import { UpdateTtpUsedDto } from './dto/update-ttp-used.dto';
import { SelectTtpUsedDto } from './dto/select-ttp-used.dto';

@Controller('ttp-used')
export class TtpUsedController {
  constructor(private readonly ttpUsedService: TtpUsedService) {}

  @Post()
  async createTtpUsed(
    @Body() createTtpUsedDto: CreateTtpUsedDto,
  ): Promise<SelectTtpUsedDto> {
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
  async getAllTtpUsedForScenario(
    @Query('scenario_number') scenario_number: string,
    @Query('project_id') scenario_project_id: number,
  ): Promise<SelectTtpUsedDto[]> {
    try {
      const ttpUsedList = await this.ttpUsedService.getAllTtpUsedByScenario(
        scenario_number,
        scenario_project_id,
      );
      return ttpUsedList;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        'Failed to fetch TTP used list for scenario',
      );
    }
  }

  @Patch()
  async updateTtpUsed(
    @Body() updateTtpUsedDto: UpdateTtpUsedDto,
  ): Promise<SelectTtpUsedDto> {
    try {
      const updatedTtpUsed =
        await this.ttpUsedService.updateTtpUsed(updateTtpUsedDto);
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
  async deleteTtpUsed(@Param('id') id: number): Promise<boolean> {
    const deleted = await this.ttpUsedService.deleteTtpUsed(id);
    if (!deleted) {
      throw new HttpException('TTP used not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
