import { GetUser } from '@common/decorators/getUser.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

  @Get()
  async findAll(): Promise<IEmployee> {
    return await this.employeesService.findAll();
  }

  @Get(':id')
  @Permissions('company.view')
  async findOne(@Param('id') id: string): Promise<IEmployee> {
    return await this.employeesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<IEmployee> {
    return await this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IEmployee> {
    return await this.employeesService.remove(id);
  }
}
