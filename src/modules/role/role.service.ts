import { Permission, PermissionDocument } from '@modules/permissions/entities/permission.entity';
import { permissionStatusEnum } from '@modules/permissions/enum/index.enum';
import { IPermission } from '@modules/permissions/interfaces/permission.interface';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionDocument } from '@modules/role-permission/entities/role-permission.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from '../../common/helpers/NestHelper';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './entities/role.entity';
import { roleStatusEnum } from './enum/index.enum';
import { IPermissionData, IRole } from './interfaces/role.interface';
@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
    @InjectModel(RolePermission.name)
    private rolePermissionModel: Model<RolePermissionDocument>,

    private readonly permissionService: PermissionsService,
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<IRole> {
    try {

      return await (await this.roleModel.create(createRoleDto)).toObject();
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(): Promise<IRole> {
    return await this.roleModel.find().lean();
  }

  async getPermissionsByRoleName(): Promise<IPermissionData[]> {
    const roleNames = ['admin', 'companyAdmin']
    let permissionsData = [];
    for (const roleName of roleNames) {
      const role = await this.roleModel.findOne({ name: roleName }).lean();
      const rolePermissionIds = (await this.rolePermissionModel.find({ roleId: role?._id })).map(e => e?.permissionId);
      const permissions = (await this.permissionModel.find({ _id: { $in: rolePermissionIds } }, { name: 1 })).map(e => e.name)
      const obj = {
        roleName,
        permissions
      }
      permissionsData.push(obj)
    }
    this.writeArrayToFile(permissionsData, 'scopes')

    return permissionsData;
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<IRole> {
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid role id',
        'invalid_role_id',
        HttpStatus.BAD_REQUEST
      );
    }
    const role = await this.roleModel.findOne({ _id: id }).exec();
    console.log({ "role": role })
    // console.log({ "rolePermission": role?.rolePermission })
    return role;
  }
  async findOneByName(roleName: string): Promise<IRole> {
    const role = await this.roleModel.findOne({ name: roleName }).lean();
    if (NestHelper.getInstance().isEmpty(role)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid role id',
        'invalid_role_id',
        HttpStatus.BAD_REQUEST
      );
    }
    return role
  }

  async createRolesAndAddPermission(name: string, clientId: mongoose.Types.ObjectId, permissions: string[]): Promise<IRole> {
    let roleExists: IRole = await this.roleModel.findOne({ name, clientId }).lean();
    if (NestHelper.getInstance().isEmpty(roleExists)) {
      const roleCreateData = {
        name: name,
        status: roleStatusEnum.active,
        details: `${name} Admin role`,
        clientId: clientId
      }
      const newRole = await this.create(roleCreateData)
      // assign permissions to new roleID
      await this.assignPermissionToNewRole(permissions, clientId, newRole?._id)
    }
    return roleExists
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<IRole> {
    return await this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).lean();
  }

  async remove(id: string): Promise<IRole> {
    return await this.roleModel.findByIdAndRemove(id).lean();
  }
  async assignPermissionToNewRole(permissions: string[], clientId: mongoose.Types.ObjectId, roleId: mongoose.Types.ObjectId): Promise<void> {
    permissions.forEach(async (permission) => {
      const permissionObj: IPermission = await this.permissionService.findOneByName(permission);

      if (permissionObj) {
        const existRolePermission = await this.rolePermissionModel.find({ permissionId: permissionObj?._id, roleId: roleId, clientId: clientId }).lean();

        if (NestHelper.getInstance().isEmpty(existRolePermission)) {
          await this.rolePermissionModel.create({
            permissionId: permissionObj?._id,
            roleId: roleId,
            clientId: clientId
          });
        }
      } else {
        //create permission and assign permission to new role
        const permissionObjDTO = {
          name: permission,
          details: 'Permission',
          clientId: clientId,
          status: permissionStatusEnum.active
        }
        const permissionObj = await this.permissionService.create(permissionObjDTO)
        const existRolePermission = await this.rolePermissionModel.find({ permissionId: permissionObj?._id, roleId: roleId, clientId: clientId }).lean();

        if (NestHelper.getInstance().isEmpty(existRolePermission)) {
          await this.rolePermissionModel.create({
            permissionId: permissionObj?._id,
            roleId: roleId,
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
      const filePath = `./src/common/rolePermissions/${fileName}.json`;
      console.log(filePath);

      // Write the JSON data to the file
      fs.writeFileSync(filePath, jsonData, 'utf-8');

      console.log(`Data written to ${fileName}.json`);
    } catch (error) {
      console.error('Error writing data to the file:', error);
    }
  }
}
