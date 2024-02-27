import { AuthService } from '@modules/auth/auth.service';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeSchema } from './entities/employee.entity';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { RolePermissionService } from '@modules/role-permission/role-permission.service';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: Permission.name, schema: PermissionSchema },
    ])],

  controllers: [EmployeeController],
  providers: [EmployeeService, UsersService, AuthService, UserRoleService, RolePermissionService, PermissionsService]
})
export class EmployeeModule { }
