import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessagesEnum } from 'src/common/enums';
import { UserRoleEnum } from 'src/modules/users/enums';
import { UserEntity } from 'src/modules/users/user.entity';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public handleRequest(
    err: Error,
    user: Partial<UserEntity>,
    info: Error,
    ctx: ExecutionContext,
  ): Partial<UserEntity> | any {
    if (info || !user) {
      throw new UnauthorizedException(ErrorMessagesEnum.UNAUTHORIZED);
    }

    const roles = this.reflector.get<UserRoleEnum[]>('roles', ctx.getHandler());

    const isValidRole = !roles || roles?.includes(user.role);
    if (!isValidRole) {
      throw new ForbiddenException(ErrorMessagesEnum.FORBIDDEN);
    }

    return user;
  }
}
