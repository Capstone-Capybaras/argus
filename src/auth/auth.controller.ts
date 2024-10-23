import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './auth.dto';
import { RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async getOne(@Body() registerDto: RegisterDto) {
    if (registerDto.confirmPassword !== registerDto.password) {
      throw new BadRequestException('Password does not match!');
    }
    try {
      return await this.authService.register(
        registerDto.username,
        registerDto.password,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(String(err));
    }
  }
}
