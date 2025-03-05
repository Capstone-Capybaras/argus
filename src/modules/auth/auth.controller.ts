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
  Get,
} from '@nestjs/common';
import { Response, Request, CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { AccessTokenResponse, SignInDto } from './auth.dto';
import { RegisterDto } from './auth.dto';
import { SelectUserDto } from '../users/dto/select-user.dto';
import { Public } from './public.guard';
import { EventsGateway } from 'src/events/events.gateway';

const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: false, // Set to true in production (requires HTTPS)
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const REFRESH_TOKEN_COOKIE = 'refreshToken';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private eventsGateway: EventsGateway,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenResponse> {
    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, cookieConfig);
    return { accessToken };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<SelectUserDto[]> {
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

  @Public()
  @Post('refresh')
  async refreshTokens(@Req() request: Request): Promise<AccessTokenResponse> {
    const storedRefreshToken = request.cookies[REFRESH_TOKEN_COOKIE];
    if (!storedRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken } =
      await this.authService.triggerRefreshToken(storedRefreshToken);

    // Return the new access token
    return { accessToken };
  }

  @Public()
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

  @Public()
  async testWebsocket() {
    this.eventsGateway.onJobFailed({
      jobId: 0,
    });
    return true;
  }

  @Get('verify')
  async verifyToken() {
    return { success: true };
  }
}
