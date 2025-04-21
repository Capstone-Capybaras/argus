import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SelectUserDto } from './dto/select-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuperUserGuard } from './super-user.guard';
import { User, UserInfo } from '../auth/user.decorator';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(SuperUserGuard)
  async getUsers(): Promise<SelectUserDto[]> {
    return this.usersService.getUsers();
  }

  @Post()
  @UseGuards(SuperUserGuard)
  async createUser(@Body() data: CreateUserDto): Promise<SelectUserDto[]> {
    try {
      return await this.usersService.addUser(data);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Patch()
  @UseGuards(SuperUserGuard)
  async updateUser(@Body() data: UpdateUserDto): Promise<SelectUserDto[]> {
    try {
      return await this.usersService.updateUserByUsername(data);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('is-super-user')
  async isUserSuperUser(@User() userInfo: UserInfo): Promise<boolean> {
    return this.usersService.validateSuperUser(userInfo.username);
  }
}
