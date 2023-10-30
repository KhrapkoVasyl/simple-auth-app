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
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() conditions: IdDto): Promise<UserEntity> {
    return this.usersService.findOne(conditions);
  }

  @UseRole(UserRoleEnum.ADMIN)
  @Post()
  createOne(@Body() createEntityDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createOne(createEntityDto);
  }

  @UseRole(UserRoleEnum.ADMIN)
  @Patch(':id')
  updateOne(
    @Param() conditions: IdDto,
    @Body() updateEntityDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateOne(conditions, updateEntityDto);
  }

  @UseRole(UserRoleEnum.ADMIN)
  @Delete(':id')
  deleteOne(@Param() conditions: IdDto): Promise<UserEntity> {
    return this.usersService.deleteOne(conditions);
  }
}
