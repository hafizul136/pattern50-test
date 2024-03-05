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
import { RoleService } from '@modules/role/role.service';
import { Role, RoleSchema } from '@modules/role/entities/role.entity';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { EmployeeRole, employeeRoleSchema } from '@modules/employee-role/entities/employee-role.entity';
import { EmailService } from '@modules/email/email.service';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: EmployeeRole.name, schema: employeeRoleSchema },
    ])],

  controllers: [EmployeeController],
  providers: [EmployeeService, UsersService, AuthService, RoleService, UserRoleService, RolePermissionService, PermissionsService, EmployeeRoleService, EmailService]
})
export class EmployeeModule { }
