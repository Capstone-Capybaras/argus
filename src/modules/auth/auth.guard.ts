import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_ROUTE } from './public.guard';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );
    // ignore public routes and all routes if local development\
    if (isPublic || process.env.NODE_ENV === 'local') return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      // if user cannot be authenticated,

      // try to verify if it's coming from aether microservice
      const publicKey = Buffer.from(
        this.formatPublicKey(
          this.configService.getOrThrow<string>('AETHER_PUBLIC_KEY'),
        ),
        'utf8',
      );

      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, _) => {
        if (err) {
          throw new UnauthorizedException(err);
        }
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private formatPublicKey(keyString: string) {
    // 1. Trim and remove the BEGIN/END lines, if present
    let body = keyString
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .trim();

    // 2. Remove all whitespace
    body = body.replace(/\s+/g, '');

    // 3. Chunk the base64 string into lines of 64 characters
    const chunkSize = 64;
    let formatted = '';
    for (let i = 0; i < body.length; i += chunkSize) {
      formatted += body.substring(i, i + chunkSize) + '\n';
    }

    // 4. Re-wrap in the standard PEM format
    return (
      '-----BEGIN PUBLIC KEY-----\n' + formatted + '-----END PUBLIC KEY-----\n'
    );
  }
}
