import { GetUser } from '@common/decorators/getUser.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateEmployeeDTOs } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';
import { IEmployee, IEmployees } from './interfaces/employee.interface';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeesService: EmployeeService) { }

  @Post()
  @Permissions('company.create')
  async create(@Body() createEmployeeDTOs: CreateEmployeeDTOs, @GetUser() user: IUser): Promise<IEmployees> {
    return await this.employeesService.create(createEmployeeDTOs, user);
  }

  @Get("list")
  @Permissions('company.view')
  async getCompanies(@Query() query, @GetUser() user: IUser): Promise<{ data?: IEmployee[], total?: number }> {
    return await this.employeesService.findAll(query, user);
  }
  @Get(':id')
  @Permissions('company.view')
  async findOne(@Param('id') id: string): Promise<IEmployee> {
    return await this.employeesService.findOne(id);
  }

  @Put(':id')
  @Permissions('company.update')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @GetUser() user: IUser): Promise<IEmployee> {
    return await this.employeesService.update(id, updateEmployeeDto,user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IEmployee> {
    return await this.employeesService.remove(id);
  }
}
