import { UserRoleEnum } from 'src/modules/users/enums';

export type JwtPayloadUser = {
  id: string;
  email: string;
  role: UserRoleEnum;
};
