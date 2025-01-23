import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { RolesToInjectService } from './roles-to-inject.service';
import { CreateRolesToInjectDto } from './dto/create-role-inj.dto';
import { UpdateRolesToInjectDto } from './dto/update-role-inject.dto';

@Controller('roles-to-inject')
export class RolesToInjectController {
  constructor(private readonly rolesToInjectService: RolesToInjectService) {}

  @Post()
  async create(@Body() createRolesToInjectDto: CreateRolesToInjectDto) {
    try {
      const roleToInject = await this.rolesToInjectService.createRolesToInject(
        createRolesToInjectDto,
      );
      return roleToInject;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('created new role to inject entry');
    }
  }

  @Get()
  async findAll() {
    try {
      const rolesToInject =
        await this.rolesToInjectService.getAllRolesToInject();
      return rolesToInject;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        'failed to retrieve all roles to injects entries',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const roleToInject =
        await this.rolesToInjectService.getRolesToInjectById(id);
      return roleToInject;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        'failed to retrieve role to inject entry with id',
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRolesToInjectDto: UpdateRolesToInjectDto,
  ) {
    try {
      const roleToInject = await this.rolesToInjectService.updateRolesToInject(
        id,
        updateRolesToInjectDto,
      );
      return roleToInject;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('failed to update role to inject entry');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const roleToInject =
        await this.rolesToInjectService.deleteRolesToInject(id);
      return roleToInject;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        'failed to delete role to inject entry of id',
      );
    }
  }
}
