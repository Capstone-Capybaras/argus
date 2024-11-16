import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { DATABASE_CONNECTION } from 'src/database/connection';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schemas from 'src/database/schema';

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
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schemas>,
  ) {}

  private async generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async validateRefreshToken(token: string): Promise<void> {
    const hashedToken = this.hashToken(token);
    const revoked = await this.database
      .select()
      .from(schemas.revokedTokensTable)
      .where(eq(schemas.revokedTokensTable.token_hash, hashedToken))
      .limit(1);
    if (!revoked || revoked.length === 0) return;
    const [revokedToken] = revoked;
    if (!revokedToken) return;
    throw new Error('refresh token has been revoked');
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

      await this.validateRefreshToken(refreshToken);

      // passed refresh token check
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

  async revokeRefreshToken(refreshToken: string) {
    return this.database.insert(schemas.revokedTokensTable).values({
      token_hash: this.hashToken(refreshToken),
    });
  }
}
