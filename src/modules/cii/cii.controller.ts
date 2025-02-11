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
import { CiiService } from './cii.service';
import { CreateCiiDto } from './dto/create-cii.dto';
import { UpdateCiiDto } from './dto/update-cii.dto';

@Controller('cii')
export class CiiController {
  constructor(private readonly ciiService: CiiService) {}

  // Create a new CII
  @Post()
  async createCii(@Body() createCiiDto: CreateCiiDto) {
    try {
      return await this.ciiService.createCII(createCiiDto);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create CII');
    }
  }

  // Get all CII
  @Get()
  async getAllCii() {
    try {
      return await this.ciiService.getAllCii();
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch CII');
    }
  }

  // Get a CII by ID
  @Get(':id')
  async getCiiById(@Param('id') id: number) {
    try {
      const cii = await this.ciiService.getCiiById(id);
      if (!cii) {
        throw new HttpException('CII not found', HttpStatus.NOT_FOUND);
      }
      return cii;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch CII');
    }
  }

  // Update a CII
  @Patch()
  async updateCii(@Body() updateCiiDto: UpdateCiiDto) {
    try {
      const updatedCii = await this.ciiService.updateCii(
        updateCiiDto.id,
        updateCiiDto,
      );
      if (!updatedCii) {
        throw new HttpException('CII not found', HttpStatus.NOT_FOUND);
      }
      return updatedCii;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update CII');
    }
  }

  // Delete a CII by ID
  @Delete(':id')
  async deleteCii(@Param('id') id: number) {
    const deleted = await this.ciiService.deleteCii(id);
    if (!deleted) {
      throw new HttpException('CII not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
