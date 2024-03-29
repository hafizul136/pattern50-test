import { GetUser } from '@common/decorators/getUser.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { IListQuery } from '@common/interfaces/list-query.interface';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateEmployeeRolesDto } from './dto/create-employee-role.dto';
import { UpdateEmployeeRoleDto } from './dto/update-employee-role.dto';
import { EmployeeRoleService } from './employee-role.service';
import { IEmployeeRole, IEmployeeRoles } from './interface/employee-role.interface';

@Controller('employee-role')
export class EmployeeRoleController {
  constructor(private readonly employeeRoleService: EmployeeRoleService) { }

  @Post('create')
  @Permissions("company.create")
  create(@Body() createEmployeeRolesDto: CreateEmployeeRolesDto, @GetUser() user: IUser): Promise<IEmployeeRoles> {
    return this.employeeRoleService.create(createEmployeeRolesDto, user);
  }

  @Get("list")
  @Permissions("company.create")
  findAll(@Query() query: IListQuery, @GetUser() user: IUser): Promise<{ data?: IEmployeeRole[], count?: number }> {
    return this.employeeRoleService.findAll(query, user);
  }

  @Get("list/dropdown")
  @Permissions("company.create")
  listDropdown(): Promise<IEmployeeRole[]> {
    return this.employeeRoleService.list();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IEmployeeRole> {
    return this.employeeRoleService.findOne(id);
  }

  // toggle role activation/deactivation
  @Patch(':id/status')
  @Permissions('company.view')
  update(@Param('id') id: string, @Body() updateEmployeeRoleDto: UpdateEmployeeRoleDto): Promise<IEmployeeRole> {
    return this.employeeRoleService.update(id, updateEmployeeRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeRoleService.remove(+id);
  }
}
