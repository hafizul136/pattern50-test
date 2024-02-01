import { mainServiceRoles } from '@common/rolePermissions';
import { RolesService } from '@modules/roles/roles.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserTypeEnum } from '@modules/users/enum/index.enum';
import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import * as passwordValidator from 'password-validator';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from '../../common/helpers/NestHelper';
import { AuthHelper } from '../../common/helpers/auth.helper';
import { DateHelper } from '../../common/helpers/date.helper';
import { appConfig } from '../../configuration/app.config';
import { PermissionsService } from '../../modules/permissions/permissions.service';
import { RolePermissionService } from '../../modules/role-permission/role-permission.service';
import { UserRoleService } from '../../modules/user-role/user-role.service';
import { UsersService } from '../../modules/users/user.service';
import { AuthDto } from './dto/auth.dto';
import { GrantType } from './enum/auth.enum';
import { IAuthResponse, IAuthToken } from './interface/auth.interface';
import { IRole } from '@modules/roles/interfaces/role.interface';
import { IUser } from '@modules/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RolesService
  ) { }
  async signUp(createUserDto: CreateUserDto, clientId: mongoose.Types.ObjectId): Promise<IAuthResponse> {
    //validity check
    const validatePassword = await this.validatePassword(createUserDto.password);
    if (!NestHelper.getInstance().isEmpty(validatePassword)) {
      ExceptionHelper.getInstance().passwordValidation(validatePassword);
    }
    // Check if user exists
    const userExists = await this.usersService.findOneByEmailSignup(
      createUserDto.email
    );
    if (userExists) {
      ExceptionHelper.getInstance().defaultError(
        'user already exists',
        'user_already_exists',
        HttpStatus.BAD_REQUEST
      );
    }
    // Hash password
    const hash = await this.hashData(createUserDto.password);
    try {
      // let user
      const userObj = {
        ...createUserDto,
        password: hash,
        clientId
      }
      const newUser: any = await this.usersService.create(userObj)

      let permissions = [];
      let permissionsObject
      if (createUserDto.userType == UserTypeEnum.companyAdmin) {
        permissionsObject = await mainServiceRoles().filter(role => role.roleName == UserTypeEnum.companyAdmin);
        permissions = permissionsObject[0].permissions
        // add role and user
        setTimeout(async () => {
          await this.addScopes(newUser, createUserDto, UserTypeEnum.companyAdmin, clientId, permissions);
        })

      }else {
        permissionsObject = mainServiceRoles().filter(role => role.roleName == UserTypeEnum.admin);
        permissions = permissionsObject[0].permissions
        // add role and user
        setTimeout(async () => {
          await this.addScopes(newUser, createUserDto, UserTypeEnum.admin, clientId, permissions);
        })

      }
      const tokens = await this.getTokens(newUser);
      newUser['scopes'] = permissions
      delete newUser.password
      return { auth: tokens, user: newUser };
    } catch (error) {
      ExceptionHelper.getInstance().defaultError(
        error?.message,
        error?.code,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getStripeSecretKey(): Promise<string> {
    // todo: get stripe secret key by user client id and client secret from stripe auth
    const stripeSecretKey = appConfig.stripeSecret;
    return stripeSecretKey;
  }

  private async addScopes(user: any, createUserDto: CreateUserDto, userType: UserTypeEnum, clientId: mongoose.Types.ObjectId, permissions: string[]): Promise<void> {
    const role:IRole = await this.roleService.findOneByName(userType, clientId, permissions);

    const userRoleData = {
      userId: new mongoose.Types.ObjectId(user._id),
      roleId: new mongoose.Types.ObjectId(role._id),
      clientId: new mongoose.Types.ObjectId(clientId)
    };
    const userRole = await this.userRoleService.create(userRoleData);

    const userRoleId = new mongoose.Types.ObjectId(userRole?._id);
    await this.usersService.update(user._id, { userRoleId, clientId: createUserDto.clientId });
  }

  async signIn(data: AuthDto, clientId:mongoose.Types.ObjectId): Promise<IAuthResponse> {
    let user;
    if (data.grantType === GrantType.password) {
      // Check if user exists
      user = await this.usersService.findOneByEmail(data.email, clientId);
      if (!user) throw new BadRequestException('User does not exist');
      // Compare the provided password with the hashed password in the database
      const passwordMatches = await AuthHelper.isPasswordMatched(data.password, user.password);
      if (!passwordMatches)
        throw new BadRequestException('Password is incorrect');
    } else {
      try {
        const jwtObject = await this.jwtService.verify(data.refreshToken, { secret: appConfig.jwtRefreshToken });
        const email = jwtObject.email
        user = await this.usersService.findOneByEmail(email, clientId);
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
    const permissionsObject = await mainServiceRoles().filter(role => role.roleName == user.userType);

    user['scopes'] = permissionsObject[0].permissions
    user.lastLogin = new DateHelper().getNowInISOString();

    delete user.password
    const tokens = await this.getTokens(user);
    const authToken = { ...tokens }

    return { auth: authToken, user };
  }

  hashData(password: string): Promise<string> {
    return AuthHelper.hashPassword(password);
  }

  async getTokens(user: IUser): Promise<IAuthToken>{
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        {
          userId: user._id,
          userType: user.userType,
          clientId: user.clientId,
          email: user.email,

        },
        {
          secret: appConfig.jwtAccessToken,
          expiresIn: appConfig.jwtAccessTokenExpire,
        },
      ),
      this.jwtService.sign(
        {
          userId: user._id,
          userType: user.userType,
          clientId: user.clientId,
          email: user.email,

        },
        {
          secret: appConfig.jwtRefreshToken,
          expiresIn: appConfig.jwtRefreshTokenExpire,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // utility methods
  async validatePassword(password: string): Promise<boolean | any[]> {
    const schema = new passwordValidator();
    const validator = schema
      .is()
      .min(8)
      .has()
      .uppercase(1)
      .has(/\d{1}|[#?!@$%^&*-]{1}/, 'Should have at least one number or one special character');
    const res = validator.validate(password, { list: true, details: true });
    return res;
  }
  // async getPermissionsByUserRoleIdSignup(user, roleId):Promise<string[]> {
  //   if (NestHelper.getInstance().isEmpty(user) && !isValidObjectId(user)) {
  //     ExceptionHelper.getInstance().defaultError(
  //       'user does not exist',
  //       'user_does_not_exist',
  //       HttpStatus.NOT_FOUND
  //     );
  //   }
  //   // const userRole = await this.userRoleService.find(user);
  //   let rolePermissions = [];
  //   if (!NestHelper.getInstance().isEmpty(roleId)) {
  //     rolePermissions = await this.rolePermissionService.findAllByRoleId(roleId, user)
  //   }
  //   const rolePermissionIds: mongoose.Types.ObjectId[] = await Utils.extractIdsFromRolePermissions(rolePermissions);
  //   const res = (
  //     await this.permissionsService.findAllByIds(
  //       rolePermissionIds, user
  //     )).map(e => e.name);

  //   return res;
  // }
}