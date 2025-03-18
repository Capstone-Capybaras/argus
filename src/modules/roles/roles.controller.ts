import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
  Query,
  ParseIntPipe,
  Put,
  InternalServerErrorException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-roles.dto';
import {
  BatchUpdateRolesDto,
  BatchUpdateRolesResponse,
} from './dto/update-roles.dto';
import { SelectRoleDto } from './dto/select-roles.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Create a new role
  @Post()
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<SelectRoleDto> {
    try {
      const role = await this.rolesService.createRole(createRoleDto);
      return role;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to create role ${error}`);
    }
  }

  // Get all roles
  @Get()
  async getAllRolesByEntityId(
    @Query('entity_id', ParseIntPipe) entityId: number,
  ): Promise<SelectRoleDto[]> {
    try {
      const roles = await this.rolesService.getAllRolesForEntity(entityId);
      return roles;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Failed to fetch roles ${error}`);
    }
  }

  @Put('batch')
  async batchUpdateRoles(
    @Body() batchUpdateRoleDto: BatchUpdateRolesDto,
  ): Promise<BatchUpdateRolesResponse> {
    if (batchUpdateRoleDto.roles.length === 0) {
      throw new BadRequestException('No entries provided');
    }
    try {
      const result =
        await this.rolesService.batchUpdateRoles(batchUpdateRoleDto);
      return result;
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  // Delete a role by name
  @Delete()
  async deleteRole(
    @Query('name') name: string,
    @Query('entity_id') entity_id: number,
  ) {
    const deleted = await this.rolesService.deleteRole(name, entity_id);
    if (!deleted) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
