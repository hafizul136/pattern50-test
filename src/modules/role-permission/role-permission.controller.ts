import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import mongoose from 'mongoose';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolePermissionService } from './role-permission.service';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) { }

  @Post()
  async create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return await this.rolePermissionService.create(createRolePermissionDto);
  }
  @Post("update-object-id")
  async makeAllObjectId() {
    return await this.rolePermissionService.makeAllObjectId();
  }

  @Get()
  async findAll() {
    return await this.rolePermissionService.findAll();
  }
  @Get("by-role/:roleId")
  async findAllByRoleId(@GetUser() user, @Param('roleId') roleId: mongoose.Types.ObjectId) {
    return await this.rolePermissionService.findAllByRoleId(roleId, user);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolePermissionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.rolePermissionService.update(+id, updateRolePermissionDto);
  }

  @Post("assign-permission/:userRoleId")
  async assignPermissions(@Param() param: { userRoleId: string }, @Body() body) {
    return await this.rolePermissionService.assignPermissionToCompanyAdmin(param.userRoleId, body);
  }

  @Post("script-assign-permissions/:userRoleId")
  async assignUserPermissions(@Param() param: { userRoleId: string }, @Body() body) {
    return await this.rolePermissionService.assignUserPermissions(param.userRoleId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolePermissionService.remove(+id);
  }
}
