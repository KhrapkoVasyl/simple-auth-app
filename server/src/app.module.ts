import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { DatabaseModule } from './systems/database';
import { UsersModule } from './modules/users';

@Module({
  imports: [AppConfigModule, DatabaseModule, UsersModule],
})
export class AppModule {}
