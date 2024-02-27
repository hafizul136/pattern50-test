import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CompanyController } from './controllers/company.controller';
import { Company, CompanySchema } from './entities/company.entity';
import { CompanyService } from './services/company.service';
import { Address, AddressSchema } from '@modules/address/entities/address.entity';
import { BillingInfo, BillingInfoSchema } from '@modules/billing-info/entities/billing-info.entity';
import { AddressService } from '@modules/address/services/address.service';
import { BillingInfoService } from '@modules/billing-info/services/billing-info.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@modules/users/user.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { AuthService } from '@modules/auth/auth.service';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { RolesService } from '@modules/roles/roles.service';
import { Role, RoleSchema } from '@modules/roles/entities/role.entity';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { Permission } from '@modules/permissions/entities/permission.entity';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Address.name, schema: AddressSchema },
      { name: BillingInfo.name, schema: BillingInfoSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: Permission.name, schema: UserRoleSchema },
      { name: RolePermission.name, schema:RolePermissionSchema },
    ])],

  controllers: [CompanyController],
  providers: [CompanyService, AddressService, BillingInfoService, JwtService, AuthService, UsersService, RolesService,UserRoleService,PermissionsService]
})
export class CompanyModule { }
