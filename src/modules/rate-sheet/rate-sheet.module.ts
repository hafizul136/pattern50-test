import { AuthService } from '@modules/auth/auth.service';
import { EmailService } from '@modules/email/email.service';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { EmployeeRole, employeeRoleSchema } from '@modules/employee-role/entities/employee-role.entity';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Role, RoleSchema } from '@modules/role/entities/role.entity';
import { RoleService } from '@modules/role/role.service';
import { TeamRate, TeamRateSchema } from '@modules/team-rates/entities/team-rate.entity';
import { TeamRatesService } from '@modules/team-rates/team-rates.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/user.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RateSheet, RateSheetSchema } from './entities/rate-sheet.entity';
import { RateSheetController } from './rate-sheet.controller';
import { RateSheetService } from './rate-sheet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RateSheet.name, schema: RateSheetSchema },
      { name: EmployeeRole.name, schema: employeeRoleSchema },
      { name: TeamRate.name, schema: TeamRateSchema },
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
    ])
  ],
  controllers: [RateSheetController],
  providers: [
    RateSheetService,
    EmployeeRoleService,
    TeamRatesService,
    JwtService, UsersService, AuthService, UserRoleService, RoleService, PermissionsService, EmailService
  ],
})
export class RateSheetModule { }
