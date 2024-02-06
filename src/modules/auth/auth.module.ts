import { ClientService } from '@modules/client/client.service';
import { Client, ClientSchema } from '@modules/client/entities/client.entity';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { RolePermissionService } from '@modules/role-permission/role-permission.service';
import { Role, RoleSchema } from '@modules/roles/entities/role.entity';
import { RolesService } from '@modules/roles/roles.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/user.service';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccountingRMQClientModule } from '@common/rabbitMQ/client/accounting.rmq.client.module';

@Module({
    imports: [
        AccountingRMQClientModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: UserRole.name, schema: UserRoleSchema },
            { name: Role.name, schema: RoleSchema },
            { name: RolePermission.name, schema: RolePermissionSchema },
            { name: Permission.name, schema: PermissionSchema },
            { name: Client.name, schema: ClientSchema },
        ]),
        JwtModule.register({}),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, AccessTokenStrategy, RefreshTokenStrategy, UserRoleService, RolesService, RolePermissionService, PermissionsService, ClientService],
})
export class AuthModule { }
