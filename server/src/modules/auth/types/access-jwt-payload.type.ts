import { UserRoleEnum } from 'src/modules/users/enums';

export type AccessJwtPayload = {
  id: string;
  email: string;
  role: UserRoleEnum;
};
