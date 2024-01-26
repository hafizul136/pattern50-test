import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GetUser } from 'common/decorators/getUser.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionsService.create(createPermissionDto);
  }

  @Post("script-create")
  async createPermission(@Body() body: any) {
    return await this.permissionsService.createPermissions(body)
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get("by-ids")
  findAllByIds(@GetUser() user, @Body() findPermissionsByIdsDto) {
    return this.permissionsService.findAllByIds(findPermissionsByIdsDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
