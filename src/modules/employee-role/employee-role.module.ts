import { AuthService } from '@modules/auth/auth.service';
import { DatabaseService } from '@modules/db/database.service';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Role, RoleSchema } from '@modules/roles/entities/role.entity';
import { RolesService } from '@modules/roles/roles.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/user.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeRoleController } from './employee-role.controller';
import { EmployeeRoleService } from './employee-role.service';
import { EmployeeRole, employeeRoleSchema } from './entities/employee-role.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeRole.name, schema: employeeRoleSchema },
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
    ])],
  controllers: [EmployeeRoleController],
  providers: [EmployeeRoleService, DatabaseService, JwtService, UsersService, AuthService, UserRoleService, RolesService, PermissionsService],
})
export class EmployeeRoleModule { }
