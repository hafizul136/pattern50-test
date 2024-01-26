import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { AuthHelper } from '../../common/helpers/auth.helper';
import { appConfig } from '../../configuration/app.config';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { PermissionsService } from '../../modules/permissions/permissions.service';
import { RolePermission } from '../../modules/role-permission/entities/role-permission.entity';
import { RolePermissionService } from '../../modules/role-permission/role-permission.service';
import { Role } from '../../modules/roles/entities/role.entity';
import { RolesService } from '../../modules/roles/roles.service';
import { UserRole } from '../../modules/user-role/entities/user-role.entity';
import { UserRoleService } from '../../modules/user-role/user-role.service';
import { User } from '../../modules/users/entities/user.entity';
import { UsersService } from '../../modules/users/user.service';
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
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTAyYmEwNDg4NjQxNzUxMDE4NmFkNmEiLCJ1c2VyVHlwZSI6ImFkbWluIiwiY2xpZW50SWQiOiI2NTAzMDdhZTNiODE0NDdlNWQ3OTM0MjUiLCJlbWFpbCI6IjZzZW5zZWV2QGdtYWlsLmNvbSIsImlhdCI6MTY5NDc1NTEwNiwiZXhwIjoxNjk0NzU1NDA2fQ.SKL_99XixRTrrdyAnaU4Vy9_0260F2PbY1DiO9SA0R0",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTAyYmEwNDg4NjQxNzUxMDE4NmFkNmEiLCJ1c2VyVHlwZSI6ImFkbWluIiwiY2xpZW50SWQiOiI2NTAzMDdhZTNiODE0NDdlNWQ3OTM0MjUiLCJlbWFpbCI6IjZzZW5zZWV2QGdtYWlsLmNvbSIsImlhdCI6MTY5NDc1NTEwNiwiZXhwIjoxNjk1MzU5OTA2fQ.kHoTSMsmAzpm2R-UrG-P0oXAJy5Lbtf0tkXuoEHzQXk"
        },
        "user": {
            "_id": "6502ba04886417510186ad6a",
            "firstName": "pattern50",
            "lastName": "ev",
            "email": "pattern50@gmail.com",
            "userRoleId": "6501900e2f99c0a2f71035b9",
            "verificationCode": "",
            "registrationType": "password",
            "userType": "admin",
            "status": "active",
            "clientId": "650307ae3b81447e5d793425",
            "isRegistered": true,
            "isVerified": false,
            "isDeleted": false,
            "lastLogin": "2023-09-15T05:18:26.010Z",
            "created_at": "2023-09-14T07:45:08.811Z",
            "updated_at": "2023-09-14T07:45:08.811Z",
            "__v": 0,
            "scopes": [
                "role.create"
            ]
        }
    }
    const mockUser: any = {
        "_id": {
            "$oid": "6502ba04886417510186ad6a"
        },
        "firstName": "pattern50",
        "lastName": "ev",
        "email": "pattern50@gmail.com",
        "password": "$2a$10$oekQIdVqr/R9V9WGM7ZcLuAs59mcTGY/yGM7TDbhPqM3OU8mRB9ym",
        "userRoleId": "6501900e2f99c0a2f71035b9",
        "verificationCode": "",
        "registrationType": "password",
        "userType": "admin",
        "status": "active",
        "clientId": "650307ae3b81447e5d793425",
        "isRegistered": true,
        "isVerified": false,
        "isDeleted": false,
        "lastLogin": {
            "$date": "2023-09-14T07:44:23.880Z"
        },
        "created_at": {
            "$date": "2023-09-14T07:45:08.811Z"
        },
        "updated_at": {
            "$date": "2023-09-14T07:45:08.811Z"
        },
        "__v": 0
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UsersService,
                JwtService,
                UserRoleService,
                RolePermissionService,
                PermissionsService,
                RolesService,
                { provide: getModelToken(User.name), useValue: mockAuthService },

                { provide: getModelToken(UserRole.name), useValue: userRoleModel },
                { provide: getModelToken(RolePermission.name), useValue: rolePermissionModel },
                { provide: getModelToken(Permission.name), useValue: permissionModel },
                { provide: getModelToken(Role.name), useValue: roleModel }],
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
            const mockLoginUser = {
                "grantType": "password",
                "email": "60senseev@gmail.com",
                "password": "EV12345678",
                "refreshToken": "kljadsfkl"
            }

            jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(mockUser);

            await expect(authService.signIn(mockLoginUser)).rejects.toThrowError();
        });
        it('should throw error if password does not match', async () => {
            const mockLoginUser = {
                "grantType": "password",
                "email": "pattern50@gmail.com",
                "password": "EV12345678",
                "refreshToken": "refreshToken"
            }
            jest.spyOn(AuthHelper, 'isPasswordMatched').mockImplementationOnce(() => Promise.resolve(false));
            const res = authService.signIn(mockLoginUser as AuthDto)
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

            jest.spyOn(authService, 'getPermissionsByUserRoleId').mockImplementationOnce(() => Promise.resolve(mockAuthUser.scopes));

            jest.spyOn(authService, 'getTokens').mockImplementationOnce(() => Promise.resolve(mockAuthUser.auth));
            jest.spyOn(authService, 'signIn').mockImplementationOnce(() => Promise.resolve(mockAuthUser));

            const res = await authService.signIn(mockLoginUser as AuthDto)
            expect(res).toEqual(mockAuthUser)
        });
        // it('should password match', async () => {
        //     const mockLoginUser = {
        //         "grantType": "password",
        //         "email": "pattern50@gmail.com",
        //         "password": "EV12345678"
        //     }
        //     jest.spyOn(AuthHelper, 'isPasswordMatched').mockImplementationOnce(() => Promise.resolve(true));

        //     const hashedPass = await bcrypt.hash(mockLoginUser.password, 10)

        //     const match = await bcrypt.compare(mockLoginUser.password, hashedPass)

        //     expect(match).toEqual(true)

        // });
        // it('should not password match', async () => {
        //     const mockLoginUser = {
        //         "grantType": "password",
        //         "email": "pattern50@gmail.com",
        //         "password": "EV12345678"
        //     }
        //     const email = "600senseev@gmail.com"
        //     const hashedPass = await bcrypt.hash(email, 10)

        //     const match = await bcrypt.compare(mockLoginUser.password, hashedPass)
        //     expect(match).toEqual(false)

        // });

        it('should call getPermissionsByUserRoleId for getting scopes', async () => {
            const mockPermissions = ["p1", "p2", "p3", "p4"]
            jest.spyOn(authService, 'getPermissionsByUserRoleId')
                .mockImplementationOnce(() => Promise.resolve(mockPermissions));

            expect(await authService.getPermissionsByUserRoleId(mockUser)).toEqual(mockPermissions)

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



        it("Should let the user sign in", async () => {
            const mockLoginUser: any = {
                "grantType": "password",
                "email": "pattern50@gmail.com",
                "password": "EV12345678"
            }

            const tokens = "kljadfkljasdlfkjlasdkfj"

            const permissions: any = [{
                "_id": "650180a2087ee9519412427e",
                "name": "role.create",
                "status": "active",
                "details": "General User",
                "clientId": "650307ae3b81447e5d793425",
                "created_at": "2023-09-13T09:28:02.895+00:00",
                "updated_at": "2023-09-13T09:28:02.895+00:00",
                "__v": 0
            }
            ]

            jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(mockUser);
            jest.spyOn(jwtService, "verify").mockImplementationOnce(mockLoginUser)
            jest.spyOn(authService, 'getPermissionsByUserRoleId').mockResolvedValueOnce(permissions);

            const res = await authService.signIn(mockLoginUser);

            expect(res.auth).toHaveProperty("accessToken")
            expect(res.auth).toHaveProperty("refreshToken")
            expect(res).toHaveProperty("user")
            expect(res).toHaveProperty("auth")
            expect(res.user).toHaveProperty("scopes")
            expect(userService.findOneByEmail).toHaveBeenCalledWith(mockLoginUser.email)
        })

        it("Should throw exception if password does not match", async () => {
            const mockLoginUser: any = {
                "grantType": "password",
                "email": "pattern50@gmail.com",
                "password": "EV123456789"
            }

            const tokens = "kljadfkljasdlfkjlasdkfj"

            const permissions: any = [{
                "_id": "650180a2087ee9519412427e",
                "name": "role.create",
                "status": "active",
                "details": "General User",
                "clientId": "650307ae3b81447e5d793425",
                "created_at": "2023-09-13T09:28:02.895+00:00",
                "updated_at": "2023-09-13T09:28:02.895+00:00",
                "__v": 0
            }
            ]

            jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(mockUser);

            await expect(authService.signIn(mockLoginUser)).rejects.toThrowError();
        })
    });
});
