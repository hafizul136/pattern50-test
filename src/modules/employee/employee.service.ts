import { AggregationHelper } from '@common/helpers/aggregation.helper';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { Utils } from '@common/helpers/utils';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
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
      //email unique check in payload
      const hasDuplicate = NestHelper.getInstance().hasDuplicateInArrayOfObject(createEmployeeDTOs?.employees, 'email')
      if (hasDuplicate) {
        ExceptionHelper.getInstance().defaultError(
          'email must be unique',
          'email_must_be_unique',
          HttpStatus.BAD_REQUEST
        );
      }
      const employeeDTOsPromises = createEmployeeDTOs.employees.map(async (employee) => {
        //email unique check in db
        await this.checkEmailUniqueness(employee?.email);
        // check employee role
        for (const employeeRoleId of employee?.employeeRoleIds) {
          await this.employeeRoleService.findActiveRole(String(employeeRoleId));
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

  async findAll(query: { page: string, size: string, query?: string }, user: IUser): Promise<{ data?: IEmployee[], count?: number }> {
    let aggregate = [];
    let page: number = parseInt(query?.page), size: number = parseInt(query?.size);
    if (!query?.page || parseInt(query?.page) < 1) page = 1;
    if (!query?.size || parseInt(query?.size) < 1) size = 10;

    // filter by client id
    AggregationHelper.filterByMatchAndQueriesAll(aggregate, [{ clientId: new Types.ObjectId(user?.clientId) }]);

    AggregationHelper.lookupForIdForeignKey(aggregate, "EmployeeRole", "employeeRoleId", "employeeRoles");
    AggregationHelper.unwindWithPreserveNullAndEmptyArrays(aggregate, "employeeRoles");

    // searching by 
    let trimmedQuery = null;
    if (query.query) {
      trimmedQuery = query.query.trim();
    }

    if (trimmedQuery) {

      const escapedQuery = trimmedQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      aggregate.push({
        $match: {
          $or: [
            {
              name: { $regex: escapedQuery, $options: "i" }
            },
            // { email: { $regex: escapedQuery, $options: "i" } },
            // { "employeeRoles.name": { $regex: escapedQuery, $options: "i" } },
          ]
        }
      });
    }

    AggregationHelper.getCountAndDataByFacet(aggregate, +page, +size);

    const companies = await this.employeeModel.aggregate(aggregate).exec();

    return Utils.returnListResponse(companies);
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

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto, user: IUser): Promise<IEmployee> {
    MongooseHelper.getInstance().isValidMongooseId(id)
    const oId = MongooseHelper.getInstance().makeMongooseId(id)
    await this.checkUniqueEmailWithOutItself(oId, updateEmployeeDto?.email);
    // check employee role
    for (const employeeRoleId of updateEmployeeDto?.employeeRoleIds) {
      await this.employeeRoleService.findActiveRole(String(employeeRoleId));
    }
    const employeeDTO = ConstructObjectFromDtoHelper.constructEmployeeUpdateObj(user, updateEmployeeDto);
    const employee = await this.employeeModel.findByIdAndUpdate(id, employeeDTO, { new: true }).lean();
    if (NestHelper.getInstance().isEmpty(employee)) {
      ExceptionHelper.getInstance().defaultError(
        'employee not found',
        'employee_not_found',
        HttpStatus.BAD_REQUEST
      );
    }
    return employee;
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
  private async checkUniqueEmailWithOutItself(id: mongoose.Types.ObjectId, email: string): Promise<void> {
    const employee = await this.employeeModel.findOne({ _id: { $ne: id }, email: email }).lean();
    if (!NestHelper.getInstance().isEmpty(employee)) {
      ExceptionHelper.getInstance().defaultError(
        'email must be unique',
        'email_must_be_unique',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
