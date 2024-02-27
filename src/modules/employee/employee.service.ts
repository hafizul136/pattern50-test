import { Permission, PermissionDocument } from '@modules/permissions/entities/permission.entity';
import { permissionStatusEnum } from '@modules/permissions/enum/index.enum';
import { IPermission } from '@modules/permissions/interfaces/permission.interface';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from '../../common/helpers/NestHelper';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { IPermissionData, IEmployee } from './interfaces/employee.interface';
import { StatusEnum } from '@common/enums/status.enum';
import { RolePermission } from '@modules/role-permission/entities/role-permission.entity';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    @InjectModel(RolePermission.name)
    private employeePermissionModel: Model<RolePermission>,

    private readonly permissionService: PermissionsService,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<IEmployee> {
    try {

      return await (await this.employeeModel.create(createEmployeeDto)).toObject();
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

  async getPermissionsByEmployeeName(): Promise<IPermissionData[]> {
    const employeeNames = ['admin', 'companyAdmin']
    let permissionsData = [];
    for (const employeeName of employeeNames) {
      const employee = await this.employeeModel.findOne({ name: employeeName }).lean();
      const employeePermissionIds = (await this.employeePermissionModel.find({ employeeId: employee?._id })).map(e => e?.permissionId);
      const permissions = (await this.permissionModel.find({ _id: { $in: employeePermissionIds } }, { name: 1 })).map(e => e.name)
      const obj = {
        employeeName,
        permissions
      }
      permissionsData.push(obj)
    }
    this.writeArrayToFile(permissionsData, 'scopes')

    return permissionsData;
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<IEmployee> {
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid employee id',
        'invalid_employee_id',
        HttpStatus.BAD_REQUEST
      );
    }
    const employee = await this.employeeModel.findOne({ _id: id }).exec();
    console.log({ "employee": employee })
    // console.log({ "employeePermission": employee?.employeePermission })
    return employee;
  }
  async findOneByName(employeeName: string): Promise<IEmployee> {
    const employee = await this.employeeModel.findOne({ name: employeeName }).lean();
    if (NestHelper.getInstance().isEmpty(employee)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid employee id',
        'invalid_employee_id',
        HttpStatus.BAD_REQUEST
      );
    }
    return employee
  }

  async createEmployeesAndAddPermission(name: string, clientId: mongoose.Types.ObjectId, permissions: string[]): Promise<IEmployee> {
    let employeeExists: IEmployee = await this.employeeModel.findOne({ name, clientId }).lean();
    if (NestHelper.getInstance().isEmpty(employeeExists)) {
      const employeeCreateData = {
        name: name,
        status: StatusEnum.ACTIVE,
        details: `${name} Admin employee`,
        clientId: clientId
      }
      const newEmployee = await this.create(employeeCreateData)
      // assign permissions to new employeeID
      await this.assignPermissionToNewEmployee(permissions, clientId, newEmployee?._id)
    }
    return employeeExists
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<IEmployee> {
    return await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, { new: true }).lean();
  }

  async remove(id: string): Promise<IEmployee> {
    return await this.employeeModel.findByIdAndRemove(id).lean();
  }
  async assignPermissionToNewEmployee(permissions: string[], clientId: mongoose.Types.ObjectId, employeeId: mongoose.Types.ObjectId): Promise<void> {
    permissions.forEach(async (permission) => {
      const permissionObj: IPermission = await this.permissionService.findOneByName(permission);

      if (permissionObj) {
        const existEmployeePermission = await this.employeePermissionModel.find({ permissionId: permissionObj?._id, employeeId: employeeId, clientId: clientId }).lean();

        if (NestHelper.getInstance().isEmpty(existEmployeePermission)) {
          await this.employeePermissionModel.create({
            permissionId: permissionObj?._id,
            employeeId: employeeId,
            clientId: clientId
          });
        }
      } else {
        //create permission and assign permission to new employee
        const permissionObjDTO = {
          name: permission,
          details: 'Permission',
          clientId: clientId,
          status: permissionStatusEnum.active
        }
        const permissionObj = await this.permissionService.create(permissionObjDTO)
        const existEmployeePermission = await this.employeePermissionModel.find({ permissionId: permissionObj?._id, employeeId: employeeId, clientId: clientId }).lean();

        if (NestHelper.getInstance().isEmpty(existEmployeePermission)) {
          await this.employeePermissionModel.create({
            permissionId: permissionObj?._id,
            employeeId: employeeId,
            clientId: clientId
          });
        }

      }
    });
  }
  writeArrayToFile(dataArray: any[], fileName: string): void {
    try {
      // Convert the array to a JSON string
      const jsonData = JSON.stringify(dataArray, null, 2);

      // Specify the file path where you want to save the data
      const filePath = `./src/common/employeePermissions/${fileName}.json`;
      console.log(filePath);

      // Write the JSON data to the file
      fs.writeFileSync(filePath, jsonData, 'utf-8');

      console.log(`Data written to ${fileName}.json`);
    } catch (error) {
      console.error('Error writing data to the file:', error);
    }
  }
}
