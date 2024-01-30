import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from '../../common/helpers/NestHelper';
import { RolesService } from '../../modules/roles/roles.service';
import { UsersService } from '../../modules/users/user.service';
import { CreateUserRoleDto, IEnvironment } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole, UserRoleDocument } from './entities/user-role.entity';
import { IUserRole } from './interfaces/user-role.interface';
import { IUser } from '@modules/users/interfaces/user.interface';
dotenv.config();
@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(UserRole.name)
    private userRoleModel: Model<UserRoleDocument>,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService
  ) { }

  async create(createUserRoleDto: CreateUserRoleDto): Promise<IUserRole> {
    const userId = new mongoose.Types.ObjectId(createUserRoleDto?.userId)
    const roleId = new mongoose.Types.ObjectId(createUserRoleDto?.roleId)

    const user = await this.usersService.findOne(userId)
    const role = await this.rolesService.findOne(roleId);

    if (NestHelper.getInstance().isEmpty(user) || NestHelper.getInstance().isEmpty(role)) {
      ExceptionHelper.getInstance().defaultError(
        'roles & permission not found',
        'roles_and_permission_not_found',
        HttpStatus.BAD_REQUEST
      );
    }

    const existingUserRole = await this.userRoleModel.find({ userId: createUserRoleDto?.userId, roleId: createUserRoleDto?.roleId }).lean().exec();

    if (!NestHelper.getInstance().isEmpty(existingUserRole)) {
      ExceptionHelper.getInstance().defaultError(
        'user role already exists',
        'user_role_already_exists',
        HttpStatus.BAD_GATEWAY
      );
    }

    const res = await this.userRoleModel.create(createUserRoleDto);
    return res.toObject()
  }


  async find(user: IUser): Promise<IUserRole> {
    try {
      const userRoleId = new mongoose.Types.ObjectId(user?.userRoleId)
      const userRoles = await this.userRoleModel.find({ _id: userRoleId, clientId: user?.clientId }).lean()
      const userRole = NestHelper.getInstance().arrayFirstOrNull(userRoles)
      return userRole;
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        'user role already not found',
        'user_role_not_found',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  async findAll(): Promise<IUserRole[]> {
    return await this.userRoleModel.find().lean().exec();
  }

  async findOne(id: string): Promise<IUserRole> {
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid role id',
        'invalid_role_id',
        HttpStatus.BAD_REQUEST
      );
    }
    return await this.userRoleModel.findOne({ _id: new mongoose.Types.ObjectId(id) }).lean().exec();
  }

  async makeAllObjectId(): Promise<IUserRole[]> {
    const userRoles = await this.userRoleModel.find();
    userRoles.forEach(async (role) => {
      const roleToUpdate = {
        ...role,
      }
      await this.userRoleModel.findByIdAndUpdate(role?.id, roleToUpdate)
    })
    return userRoles;
  }


  async getEnvs(): Promise<IEnvironment> {
    let envs = {
      NODE_ENV: process?.env?.NODE_ENV ?? "",
      DEBUG: process?.env?.DEBUG ?? "",
      MONGODB_URL: process?.env?.MONGODB_URL ?? "",
      JWT_ACCESS_SECRET: process?.env?.JWT_ACCESS_SECRET ?? "",
      JWT_REFRESH_SECRET: process?.env?.JWT_REFRESH_SECRET ?? "",
      JWT_ACCESS_SECRET_EXPIRE: process?.env?.JWT_ACCESS_SECRET_EXPIRE ?? "",
      JWT_REFRESH_SECRET_EXPIRE: process?.env?.JWT_REFRESH_SECRET_EXPIRE ?? "",
      EIN_HASHED_SECRET: process?.env?.EIN_HASHED_SECRET ?? "",
      RMQ_URL: process?.env?.RMQ_URL ?? "",
      APP_PORT: process?.env?.APP_PORT ?? "",
      SERVER_TYPE: process?.env?.SERVER_TYPE ?? "",
      PUBLISHABLE_KEY: process?.env?.PUBLISHABLE_KEY ?? "",
      STRIPE_SECRET: process?.env?.STRIPE_SECRET ?? "",
    }

    return envs;
  }
}
