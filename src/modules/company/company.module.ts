import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Address, AddressSchema } from '@modules/address/entities/address.entity';
import { AddressService } from '@modules/address/services/address.service';
import { AuthService } from '@modules/auth/auth.service';
import { BillingInfo, BillingInfoSchema } from '@modules/billing-info/entities/billing-info.entity';
import { BillingInfoService } from '@modules/billing-info/services/billing-info.service';
import { Permission } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Role, RoleSchema } from '@modules/role/entities/role.entity';
import { RoleService } from '@modules/role/role.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { CompanyController } from './controllers/company.controller';
import { Company, CompanySchema } from './entities/company.entity';
import { CompanyService } from './services/company.service';

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
      { name: RolePermission.name, schema: RolePermissionSchema },
    ])],

  controllers: [CompanyController],
  providers: [CompanyService, AddressService, BillingInfoService, JwtService, AuthService, UsersService, RoleService, UserRoleService, PermissionsService]
})
export class CompanyModule { }
