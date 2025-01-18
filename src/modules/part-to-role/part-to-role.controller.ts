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
import { PartToRoleService } from './part-to-role.service';
import { CreateParticipantsToRolesDto } from './dto/create-part-role.dto';
import { UpdateParticipantsToRolesDto } from './dto/update-part-role.dto';

@Controller('part-to-role')
export class PartToRoleController {
  constructor(private readonly partToRoleService: PartToRoleService) {}

  @Post()
  async createPartRole(
    @Body() createPartRoleDto: CreateParticipantsToRolesDto,
  ) {
    try {
      const partRole =
        await this.partToRoleService.createPartRole(createPartRoleDto);
      return partRole;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create participant role');
    }
  }

  @Get()
  async getAllPartRoles() {
    try {
      const partRoles = await this.partToRoleService.getAllPartRoles();
      return partRoles;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch participant roles');
    }
  }

  @Get(':email')
  async getPartRoleById(@Param('email') email: string) {
    try {
      const partRole = await this.partToRoleService.getPartRoleById(email);
      if (!partRole) {
        throw new HttpException(
          'Participant role not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return partRole;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to fetch participant role');
    }
  }

  @Patch(':email')
  async updatePartRole(
    @Param('email') email: string,
    @Body() updatePartRoleDto: UpdateParticipantsToRolesDto,
  ) {
    try {
      const updatedPartRole = await this.partToRoleService.updatePartRole(
        email,
        updatePartRoleDto,
      );
      if (!updatedPartRole) {
        throw new HttpException(
          'Participant role not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedPartRole;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update participant role');
    }
  }

  @Delete(':email')
  async deletePartRole(@Param('email') email: string) {
    const deleted = await this.partToRoleService.deletePartRole(email);
    if (!deleted) {
      throw new HttpException(
        'Participant role not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return true;
  }
}
