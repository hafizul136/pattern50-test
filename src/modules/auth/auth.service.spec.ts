import { EmailService } from '@modules/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ClientRMQ } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import mongoose, { Model } from 'mongoose';
import { AuthHelper } from '../../common/helpers/auth.helper';
import { appConfig } from '../../configuration/app.config';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { PermissionsService } from '../../modules/permissions/permissions.service';
import { RolePermission } from '../../modules/role-permission/entities/role-permission.entity';
import { RolePermissionService } from '../../modules/role-permission/role-permission.service';
import { Role } from '../../modules/role/entities/role.entity';
import { UserRole } from '../../modules/user-role/entities/user-role.entity';
import { UserRoleService } from '../../modules/user-role/user-role.service';
import { User } from '../../modules/users/entities/user.entity';
import { UsersService } from '../../modules/users/user.service';
import { RoleService } from '../role/role.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
describe('AuthService', () => {
    let authService: AuthService;
    let userService: UsersService;
    let jwtService: JwtService;
    let userModel: Model<User>;
    let userRoleModel: Model<UserRole>;
    let roleModel: Model<Role>;
    let rolePermissionModel: Model<RolePermission>;
    let permissionModel: Model<Permission>;

    const mockAuthService = {
        signUp: jest.fn(),
        signIn: jest.fn(),
        hashData: jest.fn(),
        getTokens: jest.fn(),
        validatePassword: jest.fn(),
        getPermissionsByUserRoleId: jest.fn(),
    };
    const mockUserService = {
        findOneByEmail: jest.fn(),
    }
    // Mock data

    const mockAuthUser: any = {
        "auth": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWQ0ODFkMGFhNDAwYzk5ZTc1ZmVhOWEiLCJ1c2VyVHlwZSI6ImFkbWluIiwiY2xpZW50SWQiOiI2NWQ0ODE2NmFhNDAwYzk5ZTc1ZmVhNzAiLCJlbWFpbCI6ImhhZml6dWxANnNlbnNlaHEuY29tIiwiaWF0IjoxNzEwMjE2NjAzLCJleHAiOjE3MTg4NTY2MDN9.Ijs1a3mQAAZw__HRWGAfs-cnM-7M3zh2njeEevV3HSs",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWQ0ODFkMGFhNDAwYzk5ZTc1ZmVhOWEiLCJ1c2VyVHlwZSI6ImFkbWluIiwiY2xpZW50SWQiOiI2NWQ0ODE2NmFhNDAwYzk5ZTc1ZmVhNzAiLCJlbWFpbCI6ImhhZml6dWxANnNlbnNlaHEuY29tIiwiaWF0IjoxNzEwMjE2NjAzLCJleHAiOjE3MTg4NTY2MDN9.cmG9EzRQdb_5R4I5x7lscKngToENOmfFFocAhVFs_mo"
        },
        "user": {
            "_id": "65d481d0aa400c99e75fea9a",
            "firstName": "hafiz",
            "lastName": "5",
            "email": "hafizul@6sensehq.com",
            "userRoleId": "65d481d1aa400c99e75feaa0",
            "verificationCode": "",
            "registrationType": "password",
            "userType": "admin",
            "status": "active",
            "clientId": "65d48166aa400c99e75fea70",
            "isRegistered": true,
            "isVerified": false,
            "isDeleted": false,
            "lastLogin": "2024-03-12T04:10:03.140Z",
            "phone": "",
            "stripeCustomerId": "",
            "created_at": "2024-02-20T10:41:20.801Z",
            "updated_at": "2024-03-08T07:07:00.342Z",
            "__v": 0,
            "resetCode": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWQ0ODFkMGFhNDAwYzk5ZTc1ZmVhOWEiLCJ1c2VyVHlwZSI6ImFkbWluIiwiY2xpZW50SWQiOiI2NWQ0ODE2NmFhNDAwYzk5ZTc1ZmVhNzAiLCJlbWFpbCI6ImhhZml6dWxANnNlbnNlaHEuY29tIiwiaWF0IjoxNzA5ODgxNjIwLCJleHAiOjE3MDk4ODM0MjB9.5XqPxPpJ4RzPNO6r-P9YZIC3jmULZlfyD2vgHn-fpp0",
            "scopes": [
                "company.create",
                "company.update",
                "company.view",
                "company.list"
            ]
        }
    }
    const mockUser: any = {
        "_id": "65d481d0aa400c99e75fea9a",
        "firstName": "hafiz",
        "lastName": "5",
        "email": "hafizul@6sensehq.com",
        "userRoleId": "65d481d1aa400c99e75feaa0",
        "verificationCode": "",
        "registrationType": "password",
        "userType": "admin",
        "status": "active",
        "clientId": "65d48166aa400c99e75fea70",
        "isRegistered": true,
        "isVerified": false,
        "isDeleted": false,
        "lastLogin": "2024-03-12T04:10:03.140Z",
        "phone": "",
        "stripeCustomerId": "",
        "created_at": "2024-02-20T10:41:20.801Z",
        "updated_at": "2024-03-08T07:07:00.342Z",
        "__v": 0,
        "resetCode": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWQ0ODFkMGFhNDAwYzk5ZTc1ZmVhOWEiLCJ1c2VyVHlwZSI6ImFkbWluIiwiY2xpZW50SWQiOiI2NWQ0ODE2NmFhNDAwYzk5ZTc1ZmVhNzAiLCJlbWFpbCI6ImhhZml6dWxANnNlbnNlaHEuY29tIiwiaWF0IjoxNzA5ODgxNjIwLCJleHAiOjE3MDk4ODM0MjB9.5XqPxPpJ4RzPNO6r-P9YZIC3jmULZlfyD2vgHn-fpp0",
        "scopes": [
            "company.create",
            "company.update",
            "company.view",
            "company.list"
        ]
    }
    const clientId = new mongoose.Types.ObjectId('65c214270987515048e06851')
    const mockLoginUser: any = {
        "grantType": "password",
        "email": "pattern50@gmail.com",
        "password": "EV@12345678"
    }
    let usersServiceMock;
    let authHelperMock;
    beforeEach(async () => {
        usersServiceMock = {
            findOneByEmail: jest.fn(),
        };
        authHelperMock = {
            isPasswordMatched: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UsersService,
                JwtService,
                UserRoleService,
                RolePermissionService,
                PermissionsService,
                RoleService,
                {
                    provide: 'ACCOUNTING_SERVICE_RMQ',
                    useClass: ClientRMQ, // Provide the mock class instead of the real one
                },
                { provide: getModelToken(User.name), useValue: mockAuthService },
                { provide: getModelToken(UserRole.name), useValue: userRoleModel },
                { provide: getModelToken(RolePermission.name), useValue: rolePermissionModel },
                { provide: getModelToken(Permission.name), useValue: permissionModel },
                { provide: getModelToken(Role.name), useValue: roleModel },
                { provide: EmailService, useValue: {} },
                { provide: AuthHelper, useValue: authHelperMock }
            ],
        }).compile();
        //services
        authService = module.get<AuthService>(AuthService);
        userService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
        //models
        userModel = module.get<Model<User>>(getModelToken(User.name));
        userRoleModel = module.get<Model<UserRole>>(getModelToken(UserRole.name));
        roleModel = module.get<Model<Role>>(getModelToken(Role.name));
        rolePermissionModel = module.get<Model<RolePermission>>(getModelToken(RolePermission.name));
        permissionModel = module.get<Model<Permission>>(getModelToken(Permission.name));
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('sign-in', () => {
        it('should call signIn method of authService with required param', async () => {
            const mockLoginUser = {
                "grantType": "password",
                "email": "pattern50@gmail.com",
                "password": "EV12345678",
                // "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTAyYmEwNDg4NjQxNzUxMDE4NmFkNmEiLCJ1c2VybmFtZSI6IjZzZW5zZWV2QGdtYWlsLmNvbSIsImlhdCI6MTY5NDY3Nzg3MywiZXhwIjoxNjk1MjgyNjczfQ.rHC5L15jxyfASw40LGZGuK5N_BSSa970wmX9Zy-kkCU"
            }
            jest
                .spyOn(mockUserService, 'findOneByEmail')
                .mockImplementationOnce(() => Promise.resolve(mockUser));

            const user = await mockUserService.findOneByEmail(mockLoginUser.email);

            const result = await mockAuthService.signIn(
                mockLoginUser as AuthDto
            );
            expect(mockAuthService.signIn).toHaveBeenCalledWith(mockLoginUser);
            expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(mockLoginUser.email);

        });

        it('should return BadRequestException if no user found', async () => {

            jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(null);

            await expect(authService.signIn(mockLoginUser, clientId)).rejects.toThrowError();
        });
        it('should throw error if password does not match', async () => {
            const mockLoginUser = {
                "grantType": "password",
                "email": "pattern50@gmail.com",
                "password": "EV12345678",
                "refreshToken": "refreshToken"
            }
            jest.spyOn(AuthHelper, 'isPasswordMatched').mockImplementationOnce(() => Promise.resolve(false));
            const res = authService.signIn(mockLoginUser as AuthDto, clientId)
            expect(res).rejects.toThrowError()
        });
        it('should login user if password is matched', async () => {
            const mockLoginUser = {
                "grantType": "password",
                "email": "pattern50@gmail.com",
                "password": "EV12345678",
                "refreshToken": "refreshToken"
            }
            jest.spyOn(AuthHelper, 'isPasswordMatched').mockImplementationOnce(() => Promise.resolve(true));
            jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));


            jest.spyOn(authService, 'getTokens').mockImplementationOnce(() => Promise.resolve(mockAuthUser.auth));
            jest.spyOn(authService, 'signIn').mockImplementationOnce(() => Promise.resolve(mockAuthUser));

            const res = await authService.signIn(mockLoginUser as AuthDto, clientId)
            expect(res).toEqual(mockAuthUser)
        });

        it('should password match', async () => {
            const mockLoginUser = {
                "grantType": "password",
                "email": "pattern50@gmail.com",
                "password": "EV12345678"
            }
            jest.spyOn(AuthHelper, 'isPasswordMatched').mockImplementationOnce(() => Promise.resolve(true));

            const hashedPass = await bcrypt.hash(mockLoginUser.password, 10)

            const match = await bcrypt.compare(mockLoginUser.password, hashedPass)

            expect(match).toEqual(true)
        });

        it('should not password match', async () => {
            const mockLoginUser = {
                "grantType": "password",
                "email": "pattern50@gmail.com",
                "password": "EV12345678"
            }
            const email = "600senseev@gmail.com"
            jest.spyOn(AuthHelper, 'isPasswordMatched').mockImplementationOnce(() => Promise.resolve(false));
            const hashedPass = await bcrypt.hash(email, 10)

            const match = await bcrypt.compare(mockLoginUser.password, hashedPass)
            expect(match).toEqual(false)

        });

        it('should call getTokens and get access_token and refresh_token', async () => {

            const tokens = {
                accessToken: "access_token",
                refreshToken: "refresh_token"
            }
            jest.spyOn(authService, 'getTokens')
                .mockImplementationOnce(() => Promise.resolve(tokens));

            expect(await authService.getTokens(mockUser)).toEqual(tokens)

        });
        it('should verify jwt service', async () => {

            const verified =
            {
                "exp": "1695282673", "iat":
                    "1694677873",
                "sub":
                    "6502ba04886417510186ad6a",
                "username":
                    "pattern50@gmail.com",

            }
            const data = {}
            jest.spyOn(jwtService, 'verify')
                .mockImplementationOnce(() => Promise.resolve(verified));

            expect(await jwtService.verify("abc", { secret: appConfig.jwtRefreshToken })).toEqual(verified)

        });

        // it('should throw BadRequestException if password is incorrect', async () => {
        //     usersServiceMock.findOneByEmail.mockResolvedValueOnce({ password: 'hashedPassword' });
        //     authHelperMock.isPasswordMatched.mockRejectedValueOnce(new Error("Password is incorrect"));
        //     expect(authService.signIn(mockLoginUser, clientId)).rejects.toThrowError("Password is incorrect");
        // });
    });
});
