import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SelectUserDto } from './dto/select-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserInfo } from '../auth/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<Omit<SelectUserDto, 'is_super_user'>[]> {
    return this.usersService.getUsers();
  }

  @Post()
  async createUser(
    @User() originUser: UserInfo,
    @Body() data: CreateUserDto,
  ): Promise<SelectUserDto[]> {
    const allowed = await this.usersService.validateSuperUser(
      originUser.username,
    );
    if (!allowed) {
      throw new ForbiddenException('Not super user, cannot edit users');
    }
    return this.usersService.addUser(data);
  }

  @Patch()
  async updateUser(
    @User() originUser: UserInfo,
    @Body() data: UpdateUserDto,
  ): Promise<SelectUserDto[]> {
    const allowed = await this.usersService.validateSuperUser(
      originUser.username,
    );
    if (!allowed) {
      throw new ForbiddenException('Not super user, cannot edit users');
    }
    return this.usersService.updateUserByUsername(data);
  }
}
