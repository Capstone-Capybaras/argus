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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';
import { SelectRoleDto } from './dto/select-roles.dto';

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
      throw new BadRequestException('Failed to create role');
    }
  }

  // Get all roles
  @Get()
  async getAllRoles(): Promise<SelectRoleDto[]> {
    try {
      const roles = await this.rolesService.getAllRoles();
      return roles;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch roles');
    }
  }

  // Get a role by name
  @Get(':name')
  async getRoleById(@Param('name') name: string): Promise<SelectRoleDto> {
    try {
      const role = await this.rolesService.getRoleById(name);
      if (!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      return role;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch role');
    }
  }

  // Update a role by name
  @Patch()
  async updateRole(
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<SelectRoleDto> {
    try {
      const updatedRole = await this.rolesService.updateRole(
        updateRoleDto.name,
        updateRoleDto,
      );
      if (!updatedRole) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      return updatedRole;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update role');
    }
  }

  // Delete a role by name
  @Delete(':name')
  async deleteRole(@Param('name') name: string) {
    const deleted = await this.rolesService.deleteRole(name);
    if (!deleted) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
