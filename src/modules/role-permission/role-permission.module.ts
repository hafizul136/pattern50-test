import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { Role, RoleSchema } from '@modules/roles/entities/role.entity';
import { RolesService } from '@modules/roles/roles.service';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RolePermission, RolePermissionSchema } from './entities/role-permission.entity';
import { RolePermissionController } from './role-permission.controller';
import { UsersService } from '@modules/users/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [RolePermissionController],
  providers: [
    RolePermissionService,
    PermissionsService,
    RolesService,
    UserRoleService,
    UsersService
  ]
})
export class RolePermissionModule { }
