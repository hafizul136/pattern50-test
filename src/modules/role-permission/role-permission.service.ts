import { IPermission } from '@modules/permissions/interfaces/permission.interface';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from '../../common/helpers/NestHelper';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { RolePermission, RolePermissionDocument } from './entities/role-permission.entity';
import { IRolePermission } from './interfaces/rolePermission.interface';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectModel(RolePermission.name)
    private rolePermissionModel: Model<RolePermissionDocument>,
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
    private readonly userRoleService: UserRoleService,
  ) { }

  async create(createRolePermissionDto: CreateRolePermissionDto): Promise<IRolePermission> {
    const permission = await this.permissionsService.findOne(createRolePermissionDto?.permissionId)
    const roleId = new mongoose.Types.ObjectId(createRolePermissionDto?.roleId)
    const role = await this.rolesService.findOne(roleId);
    if (NestHelper.getInstance().isEmpty(permission) || NestHelper.getInstance().isEmpty(role)) {
      ExceptionHelper.getInstance().defaultError(
        'roles & permission not found',
        'roles_and_permission_not_found',
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.rolePermissionModel.create(createRolePermissionDto);
  }

  // async assignPermissionToCompanyAdmin(userRoleId: string, body): Promise<void> {
  //   const userRole = await this.userRoleService.findOne(userRoleId);
  //   for (let i = 0; i < body?.permissions?.length; i++) {
  //     this.rolePermissionModel.create({
  //       permissionId: body?.permissions[i],
  //       roleId: userRole?.roleId,
  //       clientId: "650307ae3b81447e5d793425"
  //     })
  //   }
  // }

  async assignUserPermissions(userRoleId: string, body: { permissions: string[], clientId: string }): Promise<string> {
    const userRole = await this.userRoleService.findOne(userRoleId);

    if (NestHelper.getInstance().isEmpty(userRole)) {
      ExceptionHelper.getInstance().defaultError(
        "user role not found",
        "user_role_not_found",
        HttpStatus.BAD_REQUEST
      )
    }

    body?.permissions.forEach(async permission => {
      const permissionObj: IPermission = await this.permissionsService.findOneByName(permission);

      if (permissionObj) {
        const existRolePermission = await this.rolePermissionModel.find({ permissionId: permissionObj?._id, roleId: userRole?.roleId, clientId: body?.clientId }).lean();

        if (NestHelper.getInstance().isEmpty(existRolePermission)) {
          await this.rolePermissionModel.create({
            permissionId: permissionObj?._id,
            roleId: userRole?.roleId,
            clientId: body?.clientId
          })
        }
      }
    });

    return "permission assignment successful"
  }

  async findAll(): Promise<IRolePermission[]> {
    return this.rolePermissionModel.find().lean().exec();
  }

  async findOne(id: string): Promise<IRolePermission> {
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid role permission id',
        'invalid_role_permission_id',
        HttpStatus.NOT_FOUND
      );
    }
    return await this.rolePermissionModel.findOne({ _id: id }).lean().exec();
  }

  async findAllPermissionsByRoleId(roleId: mongoose.Types.ObjectId, user?: IUser): Promise<IRolePermission[]> {
    if (NestHelper.getInstance().isEmpty(roleId) && !isValidObjectId(roleId)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid role id',
        'invalid_role_id',
        HttpStatus.BAD_REQUEST
      );
    }
    if (NestHelper.getInstance().isEmpty(user?.clientId)) {
      ExceptionHelper.getInstance().defaultError(
        'client id does not exist',
        'client_id_does_not_exist',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      return await this.rolePermissionModel.find({ roleId: roleId }).lean();
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        'user role already not found',
        'user_role_not_found',
        HttpStatus.BAD_GATEWAY
      );
    }

  }

  // async update(id: number, updateRolePermissionDto: UpdateRolePermissionDto) {
  //   return `This action updates a #${id} rolePermission`;
  // }

  // async remove(id: number) {
  //   return `This action removes a #${id} rolePermission`;
  // }

  async makeAllObjectId(): Promise<IRolePermission[]> {
    const rolePermissions = await this.rolePermissionModel.find();
    rolePermissions.forEach(async (rolePermission) => {
      const rolePermissionToUpdate = {
        ...rolePermission,
      }
      await this.rolePermissionModel.findByIdAndUpdate(rolePermission?._id, rolePermissionToUpdate)
    })
    return rolePermissions;
  }
}
