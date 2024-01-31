import { StatusEnum } from '@common/enums/status.enum';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from './../../common/helpers/NestHelper';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './entities/permission.entity';
import { IPermission } from './interfaces/permission.interface';
import { IUser } from '@modules/users/interfaces/user.interface';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>
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
        const createdPermission = await this.permissionModel.create({ name: permission, status: StatusEnum.active, details: "permissions", clientId: body?.clientId });

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

  async findAllByIds(findPermissionsByIds: mongoose.Types.ObjectId[], user:IUser): Promise<IPermission[]> {
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

  async findOneByName(permissionName: string): Promise<IPermission> {
    const permissions = await this.permissionModel.find({ name: permissionName }).lean();
    return NestHelper.getInstance().arrayFirstOrNull(permissions);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<IPermission> {
    return await this.permissionModel.findByIdAndUpdate(id, updatePermissionDto, { new: true }).exec();
  }

  async remove(id: string): Promise<IPermission> {
    return await this.permissionModel.findByIdAndRemove(id).exec();
  }
}
