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

  async findOne(id: mongoose.Types.ObjectId): Promise<IEmployee> {
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid employee id',
        'invalid_employee_id',
        HttpStatus.BAD_REQUEST
      );
    }
    const employee = await this.employeeModel.findOne({ _id: id }).populate('employeeRoleId').exec();
    if (NestHelper.getInstance().isEmpty(employee)) {
      ExceptionHelper.getInstance().defaultError(
        'no employee found',
        'no_employee_found',
        HttpStatus.BAD_REQUEST
      );
    }
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
