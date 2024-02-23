import { Permissions } from '@common/decorators/permissions.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateEmployeeRolesDto } from './dto/create-employee-role.dto';
import { UpdateEmployeeRoleDto } from './dto/update-employee-role.dto';
import { EmployeeRoleService } from './employee-role.service';
import { IEmployeeRoles } from './interface/employee-role.interface';

@Controller('employee-role')
export class EmployeeRoleController {
  constructor(private readonly employeeRoleService: EmployeeRoleService) { }

  @Post('create')
  @Permissions("company.create")
  create(@Body() createEmployeeRolesDto: CreateEmployeeRolesDto): Promise<IEmployeeRoles> {
    return this.employeeRoleService.create(createEmployeeRolesDto);
  }

  @Get("list")
  findAll() {
    return this.employeeRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeRoleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeRoleDto: UpdateEmployeeRoleDto) {
    return this.employeeRoleService.update(+id, updateEmployeeRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeRoleService.remove(+id);
  }
}
