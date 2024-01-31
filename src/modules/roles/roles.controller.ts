import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Permissions } from 'common/decorators/permissions.decorator';
import mongoose from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IPermissionData, IRole } from './interfaces/role.interface';
import { RolesService } from './roles.service';

@Controller('roles')
// @UseGuards(AuthGuard('jwt'))
// @Permissions('read:resource') // Specify required permissions
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @Permissions('role.create')
  async create(@Body() createRoleDto: CreateRoleDto): Promise<IRole> {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  async findAll(): Promise<IRole> {
    return await this.rolesService.findAll();
  }

  @Get('generate-permissions-json')
  getPermissionsByRoleName(): Promise<IPermissionData[]> {
    return this.rolesService.getPermissionsByRoleName();
  }

  @Get(':id')
  async findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<IRole> {
    return await this.rolesService.findOne(id);
  }

  // @Get('name')
  // async findOneByName(@Query('name') name: string) {
  //   return await this.rolesService.findOneByName(name);
  // }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<IRole> {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IRole> {
    return await this.rolesService.remove(id);
  }
}
