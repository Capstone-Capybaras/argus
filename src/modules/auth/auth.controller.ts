import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  Res,
  Req,
  UnauthorizedException,
  Logger,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Response, Request, CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './auth.dto';
import { RegisterDto } from './auth.dto';
import { AuthGuard } from './auth.guard';

const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: false, // Set to true in production (requires HTTPS)
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const REFRESH_TOKEN_COOKIE = 'refreshToken';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, cookieConfig);
    return { accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    if (registerDto.confirmPassword !== registerDto.password) {
      throw new BadRequestException('Password does not match!');
    }
    try {
      return await this.authService.register(
        registerDto.username,
        registerDto.password,
      );
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(String(err));
    }
  }

  @Post('refresh')
  async refreshTokens(@Req() request: Request) {
    const storedRefreshToken = request.cookies[REFRESH_TOKEN_COOKIE];
    if (!storedRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken } =
      await this.authService.triggerRefreshToken(storedRefreshToken);

    // Return the new access token
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() request: Request) {
    const storedRefreshToken = request.cookies[REFRESH_TOKEN_COOKIE];
    if (!storedRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      await this.authService.revokeRefreshToken(storedRefreshToken);
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
    return true;
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  async verifyToken() {
    return { success: true };
  }
}
