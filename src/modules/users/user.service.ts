import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { mainServiceRoles } from '@common/rolePermissions';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, isValidObjectId } from 'mongoose';
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

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
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
  async userProfile(user: IUser) {
    if (NestHelper.getInstance().isEmpty(user.userId) && !isValidObjectId(user.userId)) {
      ExceptionHelper.getInstance().defaultError(
        'invalid id',
        'invalid_id',
        HttpStatus.BAD_REQUEST
      );
    }

    const permissionsObject = await mainServiceRoles().filter(role => role.roleName == user.userType);

    const scopes = permissionsObject[0].permissions

    const userInfo = await this.userModel.findOne({ _id: user.userId }, { password: 0, userRoleId: 0, created_at: 0, updated_at: 0, __v: 0 }).lean();

    return {
      ...userInfo,
      scopes
    }
  }

  // async userProfileAllInformation(id: mongoose.Types.ObjectId) {
  //   if (NestHelper.getInstance().isEmpty(id) && !isValidObjectId(id)) {
  //     ExceptionHelper.getInstance().defaultError(
  //       'invalid role id',
  //       'invalid_role_id',
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }
  //   const userInfo = await this.userModel.findOne({ _id: id }, { password: 0, userRoleId: 0, created_at: 0, updated_at: 0, __v: 0 }).lean();

  //   const scopes = 
  // }

  async findOneData(id: any) {
    const objId =await MongooseHelper.getInstance().makeMongooseId(id);
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
  async findOneByEmail(email: string, clientId?) {
    // !Change clientId
    const doc = await this.userModel.findOne({ email, clientId: clientId }).lean();
    if (!doc) ExceptionHelper.getInstance().noDataFound()
    return doc
  }

  async findOneByEmailSignup(email: string) {
    return await this.userModel.findOne({ email }).lean();

  }

  async getUserByEmailAndUserId(email: string, userId: mongoose.Schema.Types.ObjectId) {
    return await this.userModel.findOne({ email: email, _id: { $ne: userId } }).lean();

  }


  async updateStripeInfo(id: mongoose.Types.ObjectId, stripeCustomerId: string) {
    let updatedUser: IUser = await this.userModel.findByIdAndUpdate(id, { stripeCustomerId: stripeCustomerId }, { new: true }).lean();
    return updatedUser?.stripeCustomerId ?? "";
  }
  async update(id: mongoose.Schema.Types.ObjectId, updateUserDto: UpdateUserDto): Promise<IUser> {
    const res = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true, projection: { password: 0 } }).exec();
    return res.toObject();
  }

  async makeAllObjectId(){
    const user = await this.userModel.find();
    user.forEach(async (user) => {
      const userToUpdate = {
        ...user,
      }
      await this.userModel.findByIdAndUpdate(user?._id, userToUpdate)
    })
    return user;
  }
}
