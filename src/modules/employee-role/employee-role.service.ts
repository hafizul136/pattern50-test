import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { AggregationHelper } from '@common/helpers/aggregation.helper';
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

  async findAll(query) {
    let aggregate = [];
    let page: number = parseInt(query?.page), size: number = parseInt(query?.size);
    if (!query?.page || parseInt(query?.page) < 1) page = 1;
    if (!query?.size || parseInt(query?.size) < 1) size = 10;

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

    const companies = await this.employeeRoleModel.aggregate(aggregate).exec();

    return companies;
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
