import { AuthModule } from '@modules/auth/auth.module';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { RolesModule } from '@modules/roles/roles.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';

import { ClientModule } from '@modules/client/client.module';
import { CompanyAddressModule } from '@modules/company-address/company-address.module';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from 'configuration/app.config';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${appConfig.mongodbURL}${appConfig.serverType}pattern50db`),
    PermissionsModule, RolesModule, UsersModule, AuthModule, RolePermissionModule, UserRoleModule, ClientModule, CompanyAddressModule],
})
export class AppModule { }
