import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto';

export class SignUpDto extends OmitType(CreateUserDto, ['role']) {}
