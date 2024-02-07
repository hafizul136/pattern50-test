import { IUser } from '@modules/users/interfaces/user.interface';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GetUser } from 'common/decorators/getUser.decorator';
import mongoose from 'mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IPermission } from './interfaces/permission.interface';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<IPermission> {
    return await this.permissionsService.create(createPermissionDto);
  }

  @Post("script-create")
  async createPermission(@Body() body: { permissions: string[], clientId: string }): Promise<string> {
    return this.permissionsService.createPermissions(body)
  }

  @Get()
  async findAll(): Promise<IPermission[]> {
    return await this.permissionsService.findAll();
  }

  @Get("by-ids")
  async findAllByIds(@GetUser() user: IUser, @Body() findPermissionsByIdsDto: mongoose.Types.ObjectId[]): Promise<IPermission[]> {
    return await this.permissionsService.findAllByIds(findPermissionsByIdsDto, user);
  }

  // @Get('/name')
  // async findAllByName(@Query('role') roleName: string,): Promise<string[]> {
  //   return await this.permissionsService.getPermissionsByRoleNClientId(roleName);
  // }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IPermission> {
    return await this.permissionsService.findOne(id);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto): Promise<IPermission> {
    return await this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IPermission> {
    return await this.permissionsService.remove(id);
  }
}
