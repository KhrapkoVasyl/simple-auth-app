import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto, SignUpDto, UpdateProfileDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessToken, JwtPayloadUser } from './types';
import { User } from 'src/common/decorators';
import { UserEntity } from '../users/user.entity';
import { AccessTokenGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() data: SignUpDto): Promise<AccessToken> {
    return this.authService.signUp(data);
  }

  @Post('sign-in')
  signIn(@Body() data: SingInDto): Promise<AccessToken> {
    return this.authService.signIn(data);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  findProfile(@User() user: JwtPayloadUser): Promise<UserEntity> {
    return this.authService.findOne({ id: user.id });
  }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  findOne(
    @User() user: JwtPayloadUser,
    @Body() data: UpdateProfileDto,
  ): Promise<UserEntity> {
    return this.authService.updateOne({ id: user.id }, data);
  }
}
