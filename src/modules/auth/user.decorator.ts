import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
