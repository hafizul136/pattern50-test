import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@modules/auth/auth.service';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { RolePermissionService } from '@modules/role-permission/role-permission.service';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolesService } from '@modules/roles/roles.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { Role, RoleSchema } from '@modules/roles/entities/role.entity';

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
  providers: [UsersService, AuthService, UserRoleService, RolePermissionService, PermissionsService, RolesService]
})
export class UsersModule { }
