
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyAddressController } from './company-address.controller';
import { CompanyAddressService } from './company-address.service';
import { CompanyAddress, CompanyAddressSchema } from './entities/company-address.entity';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanyAddress.name, schema: CompanyAddressSchema }
    ])
  ],
  controllers: [CompanyAddressController],
  // providers: [CompanyAddressService, UsersService, AuthService, UserRoleService, RolePermissionService]
  providers: [CompanyAddressService]
})
export class CompanyAddressModule { }
