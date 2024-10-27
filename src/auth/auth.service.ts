import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  async register(username: string, pass: string) {
    const saltOrRounds = +this.configService.getOrThrow('SALT_OR_ROUNDS');
    const hash = await bcrypt.hash(pass, saltOrRounds);
    return this.usersService.addUser(username, hash);
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Wrong password given');
      }
      const payload: JwtPayload = { sub: user.id, username: user.username };
      // sign with default secret and expiry
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = await this.generateRefreshToken(payload);
      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async triggerRefreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      );

      const user = await this.usersService.findOne(payload.username);
      if (!user) {
        throw new ForbiddenException('Access Denied');
      }

      const newPayload = { sub: user.id, username: user.username };
      const newAccessToken = await this.jwtService.signAsync(newPayload);

      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
