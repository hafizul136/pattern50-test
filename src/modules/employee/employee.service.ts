import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from '../../common/helpers/NestHelper';
import { CreateEmployeeDTOs } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { IEmployee, IEmployees } from './interfaces/employee.interface';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    private employeeRoleService: EmployeeRoleService
  ) { }

  async create(createEmployeeDTOs: CreateEmployeeDTOs, user: IUser): Promise<IEmployees> {
    try {
      const employeeDTOsPromises = createEmployeeDTOs.employees.map(async (employee) => {
        await this.checkEmailUniqueness(employee?.email);
        // check employee role
        for (const employeeRoleId of employee?.employeeRoleIds) {
          await this.employeeRoleService.findOne(String(employeeRoleId));
        }
        return await ConstructObjectFromDtoHelper.constructEmployeeObj(user, employee);
      });

      // Await all promises
      const employeeDTOs = await Promise.all(employeeDTOsPromises);

      // const employeeDTO = ConstructObjectFromDtoHelper.constructEmployeeObj(user, createEmployeeDto)
      const employees: IEmployee[] = await this.employeeModel.create(employeeDTOs);
      return {
        count: employees?.length ?? 0,
        employees: employees
      }


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
