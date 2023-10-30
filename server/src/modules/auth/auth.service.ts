import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AccessToken, AccessJwtPayload } from './types';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app-config.service';
import { UserEntity } from '../users/user.entity';
import { SignUpDto, SingInDto } from './dto';
import { ErrorMessagesEnum } from 'src/common/enums';

@Injectable()
export class AuthService {
  private readonly jwtAccessSecret =
    this.appConfigService.get<string>('JWT_ACCESS_SECRET');
  private readonly jwtAccessExpiresIn = this.appConfigService.get<string>(
    'JWT_ACCESS_EXPIRES_IN',
  );

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async signUp(data: SignUpDto): Promise<AccessToken> {
    const userExists = await this.usersService
      .findOne({ email: data.email })
      .catch(() => null);

    if (userExists) {
      throw new ConflictException(ErrorMessagesEnum.USER_ALREADY_EXISTS);
    }

    const user = await this.usersService.createOne(data);
    return this.generateAccessToken(user);
  }

  async signIn({ email, password }: SingInDto): Promise<AccessToken> {
    const user = await this.usersService.findOne({ email }).catch(() => {
      throw new UnauthorizedException(ErrorMessagesEnum.UNAUTHORIZED);
    });

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException(ErrorMessagesEnum.UNAUTHORIZED);
    }

    return this.generateAccessToken(user);
  }

  async generateAccessToken({
    id,
    email,
    role,
  }: Partial<UserEntity>): Promise<AccessToken> {
    const accessTokenPayload: AccessJwtPayload = { id, email, role };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: this.jwtAccessSecret,
      expiresIn: this.jwtAccessExpiresIn,
    });

    return { accessToken };
  }

  async validate({ id, role, email }: AccessJwtPayload): Promise<UserEntity> {
    return this.usersService.findOne(
      { id, role, email },
      {
        select: { id: true, role: true, name: true },
        loadEagerRelations: false,
      },
    );
  }
}
