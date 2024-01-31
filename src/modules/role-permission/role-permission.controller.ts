import { IUser } from '@modules/users/interfaces/user.interface';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import mongoose from 'mongoose';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { IRolePermission } from './interfaces/rolePermission.interface';
import { RolePermissionService } from './role-permission.service';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) { }

  @Post()
  async create(@Body() createRolePermissionDto: CreateRolePermissionDto): Promise<IRolePermission> {
    return await this.rolePermissionService.create(createRolePermissionDto);
  }
  @Post("update-object-id")
  async makeAllObjectId(): Promise<IRolePermission[]> {
    return await this.rolePermissionService.makeAllObjectId();
  }

  @Get()
  async findAll(): Promise<IRolePermission[]> {
    return await this.rolePermissionService.findAll();
  }
  @Get("by-role/:roleId")
  async findAllByRoleId(@GetUser() user: IUser, @Param('roleId') roleId: mongoose.Types.ObjectId): Promise<IRolePermission[]> {
    return await this.rolePermissionService.findAllByRoleId(roleId, user);
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IRolePermission> {
    return await this.rolePermissionService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRolePermissionDto: UpdateRolePermissionDto) {
  //   return this.rolePermissionService.update(+id, updateRolePermissionDto);
  // }

  // @Post("assign-permission/:userRoleId")
  // async assignPermissions(@Param() param: { userRoleId: string }, @Body() body): Promise<void> {
  //   return await this.rolePermissionService.assignPermissionToCompanyAdmin(param.userRoleId, body);
  // }

  @Post("script-assign-permissions/:userRoleId")
  async assignUserPermissions(@Param() param: { userRoleId: string }, @Body() body: { permissions: string[], clientId: string }): Promise<string> {
    return await this.rolePermissionService.assignUserPermissions(param.userRoleId, body);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolePermissionService.remove(+id);
  // }
}
