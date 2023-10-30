import { ApiBearerAuth } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'src/modules/users/enums';

export const UseRole =
  (...roles: UserRoleEnum[]) =>
  (
    target: Record<string, any>,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ): void => {
    SetMetadata('roles', roles)(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
  };
