import { Permission, PermissionDocument } from '@modules/permissions/entities/permission.entity';
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
import { IRole } from './interfaces/role.interface';
import { RolePermissionService } from '@modules/role-permission/role-permission.service';
import { IPermission } from '@modules/permissions/interfaces/permission.interface';
import { PermissionsService } from '@modules/permissions/permissions.service';
@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    @InjectModel(RolePermission.name)
    private rolePermissionModel: Model<RolePermissionDocument>,
    private readonly permissionService: PermissionsService,
    ) { }

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.roleModel.create(createRoleDto);
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  findAll() {
    return this.roleModel.find().lean().exec();
  }

  async getPermissionsByRoleName(roleName: string) {
    const roleNames = ['admin', 'companyAdmin', 'driver']
    let permissionsdata = [];
    for (const roleName of roleNames) {
      const role = await this.roleModel.findOne({ name: roleName }).lean();
      const rolePermissionIds = (await this.rolePermissionModel.find({ roleId: role?._id })).map(e => e?.permissionId);
      const permissions = await (await this.permissionModel.find({ _id: { $in: rolePermissionIds } }, { name: 1 })).map(e => e.name)
      const obj = {
        roleName,
        permissions
      }
      permissionsdata.push(obj)
    }
    this.writeArrayToFile(permissionsdata, 'scopes')

    return permissionsdata;
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<IRole> {
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid role id',
        'invalid_role_id',
        HttpStatus.BAD_REQUEST
      );
    }
    return await this.roleModel.findOne({ _id: id }).lean();
  }

  async findOneByName(name: string, clientId: mongoose.Types.ObjectId, permissions:string[]) {
    let role = await this.roleModel.findOne({ name, clientId }).lean();
    if (NestHelper.getInstance().isEmpty(role)) {
      const roleCreateData = {
        name: name,
        status: roleStatusEnum.active,
        details: `${name} Admin role`,
        clientId: clientId
      }
      role = await this.create(roleCreateData)
      // assign permissions to new roleID
      await this.assignPermissionToNewRole(permissions, clientId,role?._id)
    }
    return role
  }

  update(id: string, updateRoleDto: UpdateRoleDto): any {
    return this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.roleModel.findByIdAndRemove(id).exec();
  }
  async assignPermissionToNewRole(permissions: string[], clientId: mongoose.Types.ObjectId, roleId: mongoose.Types.ObjectId) {
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
