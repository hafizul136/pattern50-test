import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { DatabaseService } from '@modules/db/database.service';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEmployeeRolesDto } from './dto/create-employee-role.dto';
import { UpdateEmployeeRoleDto } from './dto/update-employee-role.dto';
import { EmployeeRole, EmployeeRoleDocument } from './entities/employee-role.entity';
import { IEmployeeRole, IEmployeeRoles } from './interface/employee-role.interface';

@Injectable()
export class EmployeeRoleService {
  private logger = new Logger(EmployeeRole.name);
  constructor(
    @InjectModel(EmployeeRole.name)
    private readonly employeeRoleModel: Model<EmployeeRoleDocument>,

    private readonly databaseService: DatabaseService
  ) { }

  async create(createEmployeeRolesDto: CreateEmployeeRolesDto): Promise<IEmployeeRoles> {
    const employeeObjects = createEmployeeRolesDto.roles.map(role =>
      ConstructObjectFromDtoHelper.constructEmployeeRoleObj(role)
    );

    try {
      const roles: IEmployeeRole[] = await this.employeeRoleModel.create(employeeObjects);

      return {
        count: roles?.length ?? 0,
        employeeRoles: roles
      }
    } catch (err) {
      throw ExceptionHelper.getInstance().defaultError(
        "Something went wrong",
        "something_went_wrong",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  findAll() {
    return `This action returns all employeeRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employeeRole`;
  }

  update(id: number, updateEmployeeRoleDto: UpdateEmployeeRoleDto) {
    return `This action updates a #${id} employeeRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} employeeRole`;
  }
}
