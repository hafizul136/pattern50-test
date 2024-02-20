import { AuthModule } from '@modules/auth/auth.module';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { RolesModule } from '@modules/roles/roles.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { AccountingRMQClientModule } from '@common/rabbitMQ/client/accounting.rmq.client.module';
import { ClientModule } from '@modules/client/client.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from 'configuration/app.config';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { UploadModule } from './modules/upload/upload.module';
import { CompanyModule } from '@modules/company/company.module';

import { BillingInfoModule } from './modules/billing-info/billing-info.module';
import { AddressModule } from '@modules/address/address.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${appConfig.mongodbURL}${appConfig.serverType}pattern50db`),
    AccountingRMQClientModule, PermissionsModule, RolesModule, UsersModule, AuthModule, RolePermissionModule, UserRoleModule, ClientModule,UploadModule, CompanyModule, AddressModule, BillingInfoModule],
})
export class AppModule { }
