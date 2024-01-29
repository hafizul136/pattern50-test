import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { mainServiceRoles } from '@common/rolePermissions';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FlattenMaps, Model, isValidObjectId } from 'mongoose';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from '../../common/helpers/NestHelper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    return (await this.userModel.create(createUserDto)).toJSON();
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<IUser> {
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid id',
        'invalid_id',
        HttpStatus.BAD_REQUEST
      );
    }
    return await this.userModel.findOne({ _id: id }, { password: 0, userRoleId: 0, verificationCode: 0 }).lean();
  }
  async userProfile(user: IUser): Promise<FlattenMaps<IUser>> {
    if (NestHelper.getInstance().isEmpty(user.userId) && !isValidObjectId(user.userId)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid id',
        'invalid_id',
        HttpStatus.BAD_REQUEST
      );
    }

    const permissionsObject = await mainServiceRoles().filter(role => role.roleName == user.userType);

    const scopes = permissionsObject[0].permissions

    const userInfo = await this.userModel.findOne({ _id: user.userId }, { password: 0, userRoleId: 0, created_at: 0, updated_at: 0, __v: 0 }).lean()
    userInfo['scopes'] = scopes
    return userInfo
  }

  async findOneData(id: any) {
    const objId = await MongooseHelper.getInstance().makeMongooseId(id);
    if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid role id',
        'invalid_role_id',
        HttpStatus.BAD_REQUEST
      );
    }
    let aggregate = [];
    aggregate.push({
      $match: {
        _id: objId
      }
    });
    aggregate.push({ $lookup: { from: 'userroles', localField: 'userRoleId', foreignField: '_id', as: 'userRole' } })
    aggregate.push({
      $unwind: { path: "$userRole", preserveNullAndEmptyArrays: true }
    });
    aggregate.push({ $lookup: { from: 'rolepermissions', localField: 'userRole.roleId', foreignField: 'roleId', as: 'userRole.rolePermissions' } })

    aggregate.push({ $lookup: { from: 'permissions', localField: 'userRole.rolePermissions.permissionId', foreignField: '_id', as: 'userRole.rolePermissions.permissions' } })

    const res = await this.userModel.aggregate(aggregate).exec();
    const result = NestHelper.getInstance().arrayFirstOrNull(res);
    return result;
  }
  async findOneByEmail(email: string, clientId?: mongoose.Types.ObjectId): Promise<IUser> {
    // !Change clientId
    const doc = (await this.userModel.findOne({ email, clientId: clientId }).lean()).toObject();
    if (!doc) ExceptionHelper.getInstance().noDataFound()
    return doc
  }

  async findOneByEmailSignup(email: string): Promise<IUser> {
    return await this.userModel.findOne({ email }).lean();

  }

  async getUserByEmailAndUserId(email: string, userId: mongoose.Types.ObjectId): Promise<IUser>{
    return await this.userModel.findOne({ email: email, _id: { $ne: userId } }).lean();

  }


  async updateStripeInfo(id: mongoose.Types.ObjectId, stripeCustomerId: string): Promise<string>{
    let updatedUser: IUser = await this.userModel.findByIdAndUpdate(id, { stripeCustomerId: stripeCustomerId }, { new: true }).lean();
    return updatedUser?.stripeCustomerId ?? "";
  }
  async update(id: mongoose.Types.ObjectId, updateUserDto: UpdateUserDto): Promise<IUser> {
    const res = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true, projection: { password: 0 } }).exec();
    return res.toObject();
  }
}
