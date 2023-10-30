import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/config';
import { AccessTokenStrategy } from './strategies';

@Module({
  imports: [UsersModule, JwtModule.register({}), AppConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
