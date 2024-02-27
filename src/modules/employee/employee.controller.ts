import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';
import { IPermissionData, IEmployee } from './interfaces/employee.interface';

@Controller('employees')
// @UseGuards(AuthGuard('jwt'))
// @Permissions('read:resource') // Specify required permissions
export class EmployeeController {
  constructor(private readonly employeesService: EmployeeService) { }

  @Post()
  // @Permissions('employee.create')
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<IEmployee> {
    return await this.employeesService.create(createEmployeeDto);
  }

  @Get()
  async findAll(): Promise<IEmployee> {
    return await this.employeesService.findAll();
  }

  @Get('generate-permissions-json')
  getPermissionsByEmployeeName(): Promise<IPermissionData[]> {
    return this.employeesService.getPermissionsByEmployeeName();
  }

  @Get(':id')
  async findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<IEmployee> {
    return await this.employeesService.findOne(id);
  }

  // @Get('name')
  // async findOneByName(@Query('name') name: string) {
  //   return await this.employeesService.findOneByName(name);
  // }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<IEmployee> {
    return await this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IEmployee> {
    return await this.employeesService.remove(id);
  }
}
