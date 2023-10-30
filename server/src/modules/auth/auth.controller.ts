import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto, SignUpDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessToken } from './types';

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
}
