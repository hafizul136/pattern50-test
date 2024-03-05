import { Utils } from '@common/helpers/utils';
import { mainServiceRolePermissions } from '@common/rolePermissions';
import { EmailService } from '@modules/email/email.service';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { IRole } from '@modules/role/interfaces/role.interface';
import { RoleService } from '@modules/role/role.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserTypeEnum } from '@modules/users/enum/index.enum';
import { IUser } from '@modules/users/interfaces/user.interface';
import { BadRequestException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientRMQ } from '@nestjs/microservices';
import mongoose from 'mongoose';
import * as passwordValidator from 'password-validator';
import { lastValueFrom } from 'rxjs';
import { ExceptionHelper } from '../../common/helpers/ExceptionHelper';
import { NestHelper } from '../../common/helpers/NestHelper';
import { AuthHelper } from '../../common/helpers/auth.helper';
import { DateHelper } from '../../common/helpers/date.helper';
import { appConfig } from '../../configuration/app.config';
import { UserRoleService } from '../../modules/user-role/user-role.service';
import { UsersService } from '../../modules/users/user.service';
import { AuthDto } from './dto/auth.dto';
import { ForgetPassDto } from './dto/forgetPassDto';
import { GrantType } from './enum/auth.enum';
import { IAuthResponse, IAuthToken } from './interface/auth.interface';
import { IAwsSesSendEmail } from '@common/helpers/aws.service';
import { EmailTemplate } from '@common/helpers/email.template';
import { ResetForgotDto } from './dto/resetForgotDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionsService,
    @Inject('ACCOUNTING_SERVICE_RMQ')
    private readonly accountingServiceRMQClient: ClientRMQ,
    private readonly emailService: EmailService
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
        permissionsObject = mainServiceRolePermissions().filter(role => role.roleName == UserTypeEnum.companyAdmin);
        permissions = permissionsObject[0].permissions
        // add role and user
        setTimeout(async () => {
          await this.addScopes(newUser, createUserDto, UserTypeEnum.companyAdmin, clientId, permissions);
        })

      } else {
        permissionsObject = mainServiceRolePermissions().filter(role => role.roleName == UserTypeEnum.admin);
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
    const role: IRole = await this.roleService.createRolesAndAddPermission(userType, clientId, permissions);

    const userRoleData = {
      userId: new mongoose.Types.ObjectId(user._id),
      roleId: new mongoose.Types.ObjectId(role._id),
      clientId: new mongoose.Types.ObjectId(clientId)
    };
    const userRole = await this.userRoleService.create(userRoleData);

    const userRoleId = new mongoose.Types.ObjectId(userRole?._id);
    await this.usersService.update(user._id, { userRoleId, clientId: createUserDto.clientId });
  }

  async signIn(data: AuthDto, clientId: mongoose.Types.ObjectId): Promise<IAuthResponse> {
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
    const permissionsObject = mainServiceRolePermissions().filter(role => role.roleName == user.userType);
    user['scopes'] = permissionsObject[0].permissions
    // const permissions = await this.permissionService.getPermissionsByRoleNClientId(user.userType, clientId)
    // user['scopes'] = permissions
    user.lastLogin = new DateHelper().getNowInISOString();

    delete user.password
    const tokens = await this.getTokens(user);
    const authToken = { ...tokens }

    return { auth: authToken, user };
  }
  async sendForgetPasswordLink(forgetDto: ForgetPassDto, AuthUser: IUser): Promise<{ user: IUser; forgetPassLink: string }> {
    const user: IUser = await this.usersService.findOneByEmail(forgetDto.email, AuthUser?.clientId);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['user_not_found'],
      });
    } else {

      const token = this.jwtService.sign(
        { email: user.email, id: user.id },
        {
          expiresIn: '30m',
        }
      );

      await this.updateResetCode(user, token);
      let link: string = Utils.getAppUrl() + 'forgot-password/reset/' + token;


      const iAwsSesSendEmail: IAwsSesSendEmail = {
        to: user?.email,
        from: "hafizul@6sensehq.com",
        subject: "Forgot password",
        text: EmailTemplate.getForgetPasswordEmailHtml(user.firstName, user.lastName, link),
        sendersName: "Pattern50",
        //   attachments: [
        //     {
        //       filename: "document.pdf",
        //       content: "JVBERi0xLjMKJcfs...",
        //       contentType: "application/pdf",
        //       encoding: "base64"
        //     },
        //     {
        //       filename: "image.jpg",
        //       content: "/9j/4AAQSkZJRgABAQEAYABgAAD/4Q...",
        //       contentType: "image/jpeg",
        //       encoding: "base64"
        //     }
        //   ]
      }
      await this.emailService.sendEmail(iAwsSesSendEmail)
      return {
        user: user,
        forgetPassLink: link,
      };
    }
  }
  async resetForgottenPassword(
    resetDto: ResetForgotDto
  ): Promise<boolean | any[] | IAuthResponse> {
    const user = await this.getUserByResetCode(resetDto.token);
    if (!user) {
      ExceptionHelper.getInstance().throwUserNotFoundException();
    } else {
      const jwtObject = this.jwtService.verify(resetDto.token) as object;
      if (jwtObject) {
        const res = await this.forgetPassword(resetDto.token, resetDto.password, resetDto.confirmPassword);
        if (!NestHelper.getInstance().isEmpty(res)) {
          await this.updateResetCode(user, '');
          //? email res
          // await AwsServices.SimpleEmailService.sendEmail({
          //   from: process.env.FROM_EMAIL,
          //   sendersName: 'Charge OnSite',
          //   subject: 'Password reset successful',
          //   to: user.email,
          //   text: EmailTemplate.getPasswordResetSuccessEmailHtml(user.fname, user.lname),
          // });
        }
        return res;
      } else {
        ExceptionHelper.getInstance().tokenExpired();
      }
    }
  }
  async getUserByResetCode(resetCode: string): Promise<IUser> {
    return await this.usersService.getUserByResetCode(resetCode);
  }
  async forgetPassword(token: string, password: string, confirmPassword: string): Promise<IAuthResponse> {
    if (password === confirmPassword) {
      const vp = await this.validatePassword(password);
      if (!NestHelper.getInstance().isEmpty(vp)) {
        ExceptionHelper.getInstance().passwordValidation(vp);
      } else {
        const user: IUser = await this.processVerificationToken(token);
        if (!NestHelper.getInstance().isEmpty(user)) {
          const pass = await AuthHelper.hashPassword(password);
          const userData = await this.usersService.updatePassword(user.id,pass );
          return AuthHelper.getInstance().generateToken(userData, this.jwtService);
        } else {
          ExceptionHelper.getInstance().userNotMatched();
        }
      }
    } else {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['password_inconsistency'],
      });
    }
  }
  processVerificationToken = async (token: string): Promise<IUser | null> => {
    const jwtObject = this.jwtService.decode(token);
    if (jwtObject) {
      // const usr = await this.userModel.scan('email').eq(jwtObject['email']).exec();
      const usr = await this.usersService.findOneByEmailSignup(jwtObject['email']);
      return usr[0];
    } else {
      return null;
    }
  };
  async updateResetCode(user: IUser, code: string): Promise<IUser> {
    return await this.usersService.updateResetCode(user, code);
  }

  hashData(password: string): Promise<string> {
    return AuthHelper.hashPassword(password);
  }

  async getTokens(user: IUser): Promise<IAuthToken> {
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

  async test(): Promise<string> {
    console.log('Calling Acc')
    const data = {
      name: "Hafiz"
    }
    const a = await lastValueFrom(this.accountingServiceRMQClient.send('payment.create', data))
    console.log({ a })
    return a
  }
}