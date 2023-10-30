import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserRoleEnum } from 'src/modules/users/enums';
import { UserEntity } from 'src/modules/users/user.entity';

const users: Partial<UserEntity>[] = [
  {
    id: 'df6d0db6-a03c-4fd5-ad52-133887770cc0',
    role: UserRoleEnum.ADMIN,
    name: 'John Admin',
    email: 'admin@gmail.com',
    password: '$2b$10$zpRHVhg1Bzu/ugojZZVuuuvfUsRsb1gChU2Xb9rG42PaoI5/F71Si',
    group: 'ІП-04',
    variant: 17,
  },
];

export class users1698705450125 implements MigrationInterface {
  public async up({ connection }: QueryRunner): Promise<void> {
    await connection.synchronize();
    const repository = connection.getRepository(UserEntity);
    await repository.save(users, { reload: false });
  }

  public async down({ connection }: QueryRunner): Promise<void> {
    await connection
      .getRepository(UserEntity)
      .delete(users.map(({ id }) => id));
  }
}
