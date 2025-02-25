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
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { SelectAssetDto } from './dto/select-asset.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  async createAsset(
    @Body() createAssetDto: CreateAssetDto,
  ): Promise<SelectAssetDto> {
    try {
      return await this.assetsService.createAsset(createAssetDto);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to create asset: ${error}`);
    }
  }

  @Get()
  async getAllAssets(): Promise<SelectAssetDto[]> {
    try {
      return await this.assetsService.getAllAssets();
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to fetch asset ${error}`);
    }
  }

  @Get(':id')
  async getAssetById(@Param('id') id: number): Promise<SelectAssetDto> {
    try {
      const asset = await this.assetsService.getAssetById(id);
      if (!asset) {
        throw new HttpException('Asset not found', HttpStatus.NOT_FOUND);
      }
      return asset;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to fetch asset ${error}`);
    }
  }

  @Patch()
  async updateAsset(
    @Body() updateAssetDto: UpdateAssetDto,
  ): Promise<SelectAssetDto> {
    try {
      const updatedAsset = await this.assetsService.updateAsset(
        updateAssetDto.id,
        updateAssetDto,
      );
      if (!updatedAsset) {
        throw new HttpException('Asset not found', HttpStatus.NOT_FOUND);
      }
      return updatedAsset;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to update asset ${error}`);
    }
  }

  @Delete(':id')
  async deleteAsset(@Param('id') id: number) {
    const deleted = await this.assetsService.deleteAsset(id);
    if (!deleted) {
      throw new HttpException('Asset not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
