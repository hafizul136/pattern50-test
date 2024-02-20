import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Role, RoleSchema } from '@modules/roles/entities/role.entity';
import { RolesService } from '@modules/roles/roles.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRole, UserRoleSchema } from './entities/user-role.entity';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: UserRole.name, schema: UserRoleSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
    ]),
  ],
  controllers: [UserRoleController],
  providers: [UserRoleService, UsersService, RolesService, PermissionsService]
})
export class UserRoleModule { }
