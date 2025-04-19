import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
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
    return this.usersService.addUser(data);
  }

  @Patch()
  @UseGuards(SuperUserGuard)
  async updateUser(@Body() data: UpdateUserDto): Promise<SelectUserDto[]> {
    return this.usersService.updateUserByUsername(data);
  }

  @Get()
  async isUserSuperUser(@User() userInfo: UserInfo): Promise<boolean> {
    return this.usersService.validateSuperUser(userInfo.username);
  }
}
