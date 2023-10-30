import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto';

export class SingInDto extends PickType(CreateUserDto, ['email', 'password']) {}
