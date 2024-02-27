import { StatusEnum } from '@common/enums/status.enum';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from './../../common/helpers/NestHelper';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './entities/permission.entity';
import { IPermission } from './interfaces/permission.interface';
// import { IRole } from '@modules/roles/interfaces/role.interface';
import { AggregationHelper } from '@common/helpers/aggregation.helper';
import { RolePermission, RolePermissionDocument } from '@modules/role-permission/entities/role-permission.entity';
import { Role, RoleDocument } from '@modules/roles/entities/role.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(RolePermission.name) private readonly rolePermissionModel: Model<RolePermissionDocument>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
    // private readonly rolePermissionService: RolePermissionService,
    // private readonly roleService: RolesService,
  ) { }

  async create(createPermissionDto: CreatePermissionDto): Promise<IPermission> {
    return await this.permissionModel.create(createPermissionDto);
  }

  async findAll(): Promise<IPermission[]> {
    return await this.permissionModel.find().lean().exec();
  }

  async createPermissions(body: { permissions: string[], clientId: string }): Promise<string> {
    const permissions = body?.permissions;
    let num = 0;

    for (const permission of permissions) {
      const existPermission = await this.permissionModel.find({ name: permission }).lean();

      if (NestHelper.getInstance().isEmpty(existPermission)) {
        const createdPermission = await this.permissionModel.create({ name: permission, status: StatusEnum.ACTIVE, details: "permissions", clientId: body?.clientId });

        if (NestHelper.getInstance().isEmpty(createdPermission))
          ExceptionHelper.getInstance().defaultError(
            "Something went wrong",
            "something_went_wrong",
            HttpStatus.BAD_REQUEST
          )

        console.log(num++);
      }
    }
    return "created permissions";
  }

  async findAllByIds(findPermissionsByIds: mongoose.Types.ObjectId[], user: IUser): Promise<IPermission[]> {
    if (NestHelper.getInstance().isEmpty(user?.clientId)) {
      ExceptionHelper.getInstance().defaultError(
        'client id does not exist',
        'client_id_does_not_exist',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      return await this.permissionModel.find({ _id: { $in: findPermissionsByIds } }).lean().exec();
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        'user_role_not_found',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  async findOne(id: string): Promise<IPermission> {
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid permission id',
        'invalid_permission_id',
        HttpStatus.NOT_FOUND
      );
    }
    return await this.permissionModel.findOne({ _id: id }).lean().exec();
  }
  async findOneByRoleId(roleId: string): Promise<IPermission[]> {
    const permissions = await this.permissionModel.find({ roleId }).lean().exec();
    if (NestHelper.getInstance().isEmpty(permissions)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid role id',
        'invalid_role_id',
        HttpStatus.NOT_FOUND
      );
    }
    return permissions
  }

  async findOneByName(permissionName: string): Promise<IPermission> {
    const permissions = await this.permissionModel.find({ name: permissionName }).lean();
    return NestHelper.getInstance().arrayFirstOrNull(permissions);
  }
  async getPermissionsByRoleNClientId(roleName: string, clientId: mongoose.Types.ObjectId): Promise<string[]> {
    const aggregate: any = [
      {
        $match:
          { name: roleName, clientId }
      },
    ]
    AggregationHelper.lookupForIdLocalKey(aggregate, 'rolepermissions', 'roleId', 'rolepermission')
    AggregationHelper.lookupForIdForeignKey(aggregate, 'permissions', 'rolepermission.permissionId', 'permission')
    AggregationHelper.unwindAField(aggregate, 'permissions', true)
    aggregate.push({
      $project: {
        'permission.name': {
          "$map": {
            "input": "$permission",
            "as": "perm",
            "in": "$$perm.name"
          }
        }
      }
    })
    const aggregationResult = await this.roleModel.aggregate(aggregate)
    console.log({ aggregationResult })
    // const permissionNames = aggregationResult[0].permission.map(permission => permission.name);
    // console.log({ aggregationResult: JSON.stringify(aggregationResult) })

    // const role = await this.roleModel.findOne({ name: roleName, clientId }).lean();
    // if (NestHelper.getInstance().isEmpty(role)) {
    //   ExceptionHelper.getInstance().defaultError(
    //     'invalid role id',
    //     'invalid_role_id',
    //     HttpStatus.BAD_REQUEST
    //   );
    // }
    // const rolePermissionIds = (await this.rolePermissionModel.find({ roleId: role?._id }).exec()).map(e => e?.permissionId);
    // const permissions = (await this.permissionModel.find({ _id: { $in: rolePermissionIds } }, { name: 1 })).map(e => e.name)
    return aggregationResult;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<IPermission> {
    return await this.permissionModel.findByIdAndUpdate(id, updatePermissionDto, { new: true }).exec();
  }

  async remove(id: string): Promise<IPermission> {
    return await this.permissionModel.findByIdAndRemove(id).exec();
  }
}
