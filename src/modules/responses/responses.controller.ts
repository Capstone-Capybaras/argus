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
import { ResponsesService } from './responses.service';
import { CreateResponsesDto } from './dto/create-responses.dto';
import { UpdateResponsesDto } from './dto/update-responses.dto';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post()
  async createResponse(@Body() createResponsesDto: CreateResponsesDto) {
    try {
      const response =
        await this.responsesService.createResponse(createResponsesDto);
      return response;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create response');
    }
  }

  @Get()
  async getAllResponses() {
    try {
      const responses = await this.responsesService.getAllResponses();
      return responses;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch responses');
    }
  }

  @Get(':id')
  async getResponseById(@Param('id') id: number) {
    try {
      const response = await this.responsesService.getResponseById(id);
      if (!response) {
        throw new HttpException('Response not found', HttpStatus.NOT_FOUND);
      }
      return response;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch response');
    }
  }

  @Patch(':id')
  async updateResponse(
    @Param('id') id: string,
    @Body() updateResponsesDto: UpdateResponsesDto,
  ) {
    try {
      const updatedResponse = await this.responsesService.updateResponse(
        id,
        updateResponsesDto,
      );
      if (!updatedResponse) {
        throw new HttpException('Response not found', HttpStatus.NOT_FOUND);
      }
      return updatedResponse;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update response');
    }
  }

  @Delete(':id')
  async deleteResponse(@Param('id') id: number) {
    const deleted = await this.responsesService.deleteResponse(id);
    if (!deleted) {
      throw new HttpException('Response not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
