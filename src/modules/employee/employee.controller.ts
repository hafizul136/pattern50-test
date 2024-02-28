import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';
import { IEmployee } from './interfaces/employee.interface';
import { IPermissionData } from '@modules/role/interfaces/role.interface';
import { Permissions } from '@common/decorators/permissions.decorator';
import { GetUser } from '@common/decorators/getUser.decorator';
import { IUser } from '@modules/users/interfaces/user.interface';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeesService: EmployeeService) { }

  @Post()
  @Permissions('company.create')
  async create(@Body() createEmployeeDto: CreateEmployeeDto,@GetUser() user:IUser): Promise<IEmployee> {
    return await this.employeesService.create(createEmployeeDto,user);
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<IEmployee> {
    return await this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IEmployee> {
    return await this.employeesService.remove(id);
  }
}
