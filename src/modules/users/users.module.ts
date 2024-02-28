import { AuthService } from '@modules/auth/auth.service';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { RolePermissionService } from '@modules/role-permission/role-permission.service';
import { Role, RoleSchema } from '@modules/role/entities/role.entity';
import { RoleService } from '@modules/role/role.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, UserRoleService, RolePermissionService, PermissionsService, RoleService]
})
export class UsersModule { }
