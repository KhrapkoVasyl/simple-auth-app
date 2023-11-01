import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude } from 'class-transformer';
import { CommonEntity } from 'src/common/entities';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from './enums';
import { AppConfigService } from 'src/config/app-config.service';
import { ConfigService } from '@nestjs/config';

const config = new AppConfigService(new ConfigService());

@Entity({ name: 'users' })
export class UserEntity extends CommonEntity {
  @ApiProperty({ type: String, maxLength: 256, nullable: false })
  @Column({ type: 'varchar', length: 256, nullable: false })
  name: string;

  @ApiProperty({ type: String, maxLength: 256, uniqueItems: true })
  @Column({ type: 'varchar', length: 256, unique: true })
  email: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'varchar', length: 64, select: false })
  password: string;

  @ApiProperty({
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
    nullable: false,
  })
  @Column({ enum: UserRoleEnum, default: UserRoleEnum.USER, nullable: false })
  role: UserRoleEnum;

  @ApiProperty({ type: String, maxLength: 8, nullable: false })
  @Column({ type: 'varchar', length: 8, nullable: false })
  group: string;

  @ApiProperty({ type: 'integer', required: true, nullable: false })
  @Column({ type: 'integer', nullable: false })
  variant: number;

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword() {
    if (this.password) {
      console.log('\n\nThis password: ', this.password, '\n\n');
      const SALT_ROUNDS = config.get<number>('SALT_ROUNDS');
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
  }
}
