import { StatusEnum } from '@common/enums/status.enum';
import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { AggregationHelper } from '@common/helpers/aggregation.helper';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { Utils } from '@common/helpers/utils';
import { IListQuery } from '@common/interfaces/list-query.interface';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  ) { }

  // create roles
  async create(createEmployeeRolesDto: CreateEmployeeRolesDto, user: IUser): Promise<IEmployeeRoles> {
    // construct objects
    const employeeObjects = createEmployeeRolesDto.roles.map(role =>
      ConstructObjectFromDtoHelper.constructEmployeeRoleObj(role, user?.clientId)
    );

    try {
      // create in bulk operation
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

  // get list of employee roles
  async findAll(query: IListQuery, user: IUser): Promise<{ data?: IEmployeeRole[], count?: number }> {
    let aggregate = [];
    let page: number = parseInt(query?.page), size: number = parseInt(query?.size);
    if (!query?.page || parseInt(query?.page) < 1) page = 1;
    if (!query?.size || parseInt(query?.size) < 1) size = 10;

    // filter by client id
    AggregationHelper.filterByMatchAndQueriesAll(aggregate, [{ clientId: new Types.ObjectId(user?.clientId) }]);

    // get the members
    AggregationHelper.lookupForIdForeignKey(aggregate, "employee", "employeeRoleId", "members");

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
          ]
        }
      });
    }

    AggregationHelper.getCountAndDataByFacet(aggregate, +page, +size);

    const employeeRoles = await this.employeeRoleModel.aggregate(aggregate).exec();

    return Utils.returnListResponse(employeeRoles);
  }

  async list(): Promise<IEmployeeRole[]> {
    let aggregate = [];

    // filter by status
    AggregationHelper.filterByMatchAndQueriesAll(aggregate, [{ status: StatusEnum.ACTIVE }]);

    const employeeRoles = await this.employeeRoleModel.aggregate(aggregate).exec();

    return employeeRoles;
  }

  async findOne(id: string): Promise<IEmployeeRole> {
    new MongooseHelper().isValidMongooseId(id);

    const employeeRole = await this.employeeRoleModel.findById(id).lean();

    if (NestHelper.getInstance().isEmpty(employeeRole)) {
      ExceptionHelper.getInstance().defaultError(
        "Role not found",
        "role_not_found",
        HttpStatus.NOT_FOUND
      );
    }

    return employeeRole;
  }
  async findActiveRole(id: string): Promise<IEmployeeRole> {
    new MongooseHelper().isValidMongooseId(id);

    const employeeRole = await this.employeeRoleModel.findOne({ _id: id, status: StatusEnum.ACTIVE }).lean();

    if (NestHelper.getInstance().isEmpty(employeeRole)) {
      ExceptionHelper.getInstance().defaultError(
        "Role not found",
        "role_not_found",
        HttpStatus.NOT_FOUND
      );
    }

    return employeeRole;
  }

  // update employee role status
  async update(id: string, updateEmployeeRoleDto: UpdateEmployeeRoleDto): Promise<IEmployeeRole> {
    // validate if role exists by the id
    const employeeRole: IEmployeeRole = await this.findOne(id);

    if (employeeRole?.status === updateEmployeeRoleDto?.status) {
      ExceptionHelper.getInstance().defaultError(
        `Role already ${employeeRole.status}`,
        "conflicts",
        HttpStatus.BAD_REQUEST
      );
    }

    const updatedRole = await this.employeeRoleModel.findByIdAndUpdate(id, { status: updateEmployeeRoleDto.status.trim() }, { new: true });

    return updatedRole;
  }

  remove(id: number) {
    return `This action removes a #${id} employeeRole`;
  }
}
