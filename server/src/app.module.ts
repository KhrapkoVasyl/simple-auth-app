import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { DatabaseModule } from './systems/database';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, AuthModule, UsersModule],
})
export class AppModule {}
