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
      throw new BadRequestException('Failed to create asset');
    }
  }

  @Get()
  async getAllAssets(): Promise<SelectAssetDto[]> {
    try {
      return await this.assetsService.getAllAssets();
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch asset');
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
      throw new BadRequestException('Failed to fetch asset');
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
      throw new BadRequestException('Failed to update Asset');
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

  @Post('duplicate')
  async duplicateAssets(
    @Body() body: { originalEntityId: number; newEntityId: number },
  ): Promise<{ message: string; duplicatedAssets: SelectAssetDto[] }> {
    try {
      const duplicatedAssets = await this.assetsService.duplicateAssets(
        body.originalEntityId,
        body.newEntityId,
      );

      return {
        message: 'Assets duplicated successfully',
        duplicatedAssets,
      };
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to duplicate assets');
    }
  }
}
