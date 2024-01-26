import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GetUser } from 'common/decorators/getUser.decorator';
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
  async createPermission(@Body() body: any): Promise<string> {
    return this.permissionsService.createPermissions(body)
  }

  @Get()
  async findAll(): Promise<IPermission[]> {
    return await this.permissionsService.findAll();
  }

  @Get("by-ids")
  async findAllByIds(@GetUser() user, @Body() findPermissionsByIdsDto): Promise<IPermission[]> {
    return await this.permissionsService.findAllByIds(findPermissionsByIdsDto, user);
  }

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
