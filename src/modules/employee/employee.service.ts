import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from '../../common/helpers/NestHelper';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { IEmployee } from './interfaces/employee.interface';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    private employeeRoleService: EmployeeRoleService
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto, user: IUser): Promise<IEmployee> {
    try {
      await this.checkEmailUniqueness(createEmployeeDto?.email)
      // check employee role
      for (const employeeRoleId of createEmployeeDto?.employeeRoleIds) {
        await this.employeeRoleService.findOne(String(employeeRoleId));
      }
      const employeeDTO = ConstructObjectFromDtoHelper.constructEmployeeObj(user, createEmployeeDto)
      return await this.employeeModel.create(employeeDTO);
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(): Promise<IEmployee> {
    return await this.employeeModel.find().lean();
  }

  async findOne(id: string): Promise<IEmployee> {
    MongooseHelper.getInstance().isValidMongooseId(id)
    const oId = MongooseHelper.getInstance().makeMongooseId(id)
   
    const employee = await this.employeeModel.findOne({ _id: oId }).populate('employeeRoleIds').lean();
    if (NestHelper.getInstance().isEmpty(employee)) {
      ExceptionHelper.getInstance().defaultError(
        'no employee found',
        'no_employee_found',
        HttpStatus.BAD_REQUEST
      );
    }
    employee['employeeRoles'] = employee?.employeeRoleIds;
    delete employee.employeeRoleIds
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<IEmployee> {
    return await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, { new: true }).lean();
  }

  async remove(id: string): Promise<IEmployee> {
    return await this.employeeModel.findByIdAndRemove(id).lean();
  }
  // private functions
  private async checkEmailUniqueness(email: string): Promise<void> {
    const employee = await this.employeeModel.findOne({ email: email }).lean();
    if (!NestHelper.getInstance().isEmpty(employee)) {
      ExceptionHelper.getInstance().defaultError(
        'email must be unique',
        'email_must_be_unique',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
