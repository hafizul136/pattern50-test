import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UsersService } from '@modules/users/user.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { AuthService } from '@modules/auth/auth.service';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { RolePermissionService } from '@modules/role-permission/role-permission.service';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: Permission.name, schema: PermissionSchema },
    ])],

  controllers: [RolesController],
  providers: [RolesService, UsersService, AuthService, UserRoleService, RolePermissionService, PermissionsService]
})
export class RolesModule { }
