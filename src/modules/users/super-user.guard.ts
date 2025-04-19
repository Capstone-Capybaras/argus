import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserInfo } from '../auth/user.decorator';
import { UsersService } from './users.service';

@Injectable()
export class SuperUserGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserInfo;

    const allowed = await this.usersService.validateSuperUser(user.username);
    if (!allowed) {
      throw new ForbiddenException('Not super user, cannot edit users');
    }
    return true;
  }
}
