import { GetUser } from '@common/decorators/getUser.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import mongoose, { FlattenMaps } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/user.interface';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await this.usersService.create(createUserDto);
  }

  @Get('test')
  async test() {
    return 'test';
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('/me')
  @Permissions("user.edit")
  async userProfile(@GetUser() user: IUser): Promise<FlattenMaps<IUser>> {
    return await this.usersService.userProfile(user);
  }

  // @Get('/info')
  // @Permissions("user.edit")
  // async userProfileInformationAll(@GetUser() user: IUser) {
  //   return await this.usersService.userProfileAllInformation(user.userId);
  // }

  @Get(':id')
  async findOne(@Param('id') id: mongoose.Types.ObjectId) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: mongoose.Types.ObjectId, @Body() updateUserDto: UpdateUserDto): Promise<IUser> {
    return await this.usersService.update(id, updateUserDto);
  }
}
