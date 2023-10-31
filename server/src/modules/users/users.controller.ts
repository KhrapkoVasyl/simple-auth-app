import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { IdDto } from 'src/common/dto';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRoleEnum } from './enums';
import { UseRole } from '../auth/decorators';
import { AccessTokenGuard } from '../auth/guards';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseRole(UserRoleEnum.ADMIN)
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseRole(UserRoleEnum.ADMIN)
  findOne(@Param() conditions: IdDto): Promise<UserEntity> {
    return this.usersService.findOne(conditions);
  }

  @Post()
  @UseRole(UserRoleEnum.ADMIN)
  createOne(@Body() createEntityDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createOne(createEntityDto);
  }

  @Patch(':id')
  @UseRole(UserRoleEnum.ADMIN)
  updateOne(
    @Param() conditions: IdDto,
    @Body() updateEntityDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateOne(conditions, updateEntityDto);
  }

  @Delete(':id')
  @UseRole(UserRoleEnum.ADMIN)
  deleteOne(@Param() conditions: IdDto): Promise<UserEntity> {
    return this.usersService.deleteOne(conditions);
  }
}
