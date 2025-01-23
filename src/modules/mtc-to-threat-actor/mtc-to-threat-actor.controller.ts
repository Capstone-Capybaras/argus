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
import { MtcToThreatActorService } from './mtc-to-threat-actor.service';
import { CreateMasterThreatCubesToThreatActorsDto } from './dto/create-mtc-ta.dto';
import { UpdateMasterThreatCubesToThreatActorsDto } from './dto/update-mtc-ta.dto';

@Controller('mtc-to-threat-actor')
export class MtcToThreatActorController {
  constructor(
    private readonly mtcToThreatActorService: MtcToThreatActorService,
  ) {}

  @Post()
  async createMTCToTA(
    @Body() createMTCToTADto: CreateMasterThreatCubesToThreatActorsDto,
  ) {
    try {
      const newMTCToTA =
        await this.mtcToThreatActorService.createMTCToTA(createMTCToTADto);
      return newMTCToTA;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create MTC to TA');
    }
  }

  @Get()
  async getAllMTCToTA() {
    try {
      const mtcToTAList = await this.mtcToThreatActorService.getAllMTCToTA();
      return mtcToTAList;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch MTC to TA list');
    }
  }

  @Get(':id')
  async getMTCToTAById(@Param('id') id: number) {
    try {
      const mtcToTA = await this.mtcToThreatActorService.getMTCToTAById(id);
      if (!mtcToTA) {
        throw new HttpException('MTC to TA not found', HttpStatus.NOT_FOUND);
      }
      return mtcToTA;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch MTC to TA');
    }
  }

  @Patch(':id')
  async updateMTCToTA(
    @Param('id') id: string,
    @Body() updateMTCToTADto: UpdateMasterThreatCubesToThreatActorsDto,
  ) {
    try {
      const updatedMTCToTA = await this.mtcToThreatActorService.updateMTCToTA(
        id,
        updateMTCToTADto,
      );
      if (!updatedMTCToTA) {
        throw new HttpException('MTC to TA not found', HttpStatus.NOT_FOUND);
      }
      return updatedMTCToTA;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update MTC to TA');
    }
  }

  @Delete(':id')
  async deleteMTCToTA(@Param('id') id: number) {
    const deleted = await this.mtcToThreatActorService.deleteMTCToTA(id);
    if (!deleted) {
      throw new HttpException('MTC to TA not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
