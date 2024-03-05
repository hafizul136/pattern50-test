import { AccountingRMQClientModule } from '@common/rabbitMQ/client/accounting.rmq.client.module';
import { EmailRMQClientModule } from '@common/rabbitMQ/client/email.rmq.client.module';
import { AddressModule } from '@modules/address/address.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ClientModule } from '@modules/client/client.module';
import { CompanyModule } from '@modules/company/company.module';
import { DatabaseModule } from '@modules/db/mongoose.module';
import { EmployeeModule } from '@modules/employee/employee.module';
import { GeoModule } from '@modules/geo/geo.module';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { RoleModule } from '@modules/role/role.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from 'configuration/app.config';
import { BillingInfoModule } from './modules/billing-info/billing-info.module';
import { EmailModule } from './modules/email/email.module';
import { EmployeeRoleModule } from './modules/employee-role/employee-role.module';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { TechnologyCategoryModule } from './modules/technology-category/technology-category.module';
import { TechnologyToolModule } from './modules/technology-tool/technology-tool.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserRoleModule } from './modules/user-role/user-role.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${appConfig.mongodbURL}${appConfig.serverType}${appConfig.dbName}`), DatabaseModule, GeoModule,
    AccountingRMQClientModule, EmailRMQClientModule, PermissionsModule, RoleModule, UsersModule, AuthModule, RolePermissionModule, UserRoleModule, ClientModule, UploadModule, CompanyModule, AddressModule, BillingInfoModule, EmployeeRoleModule, EmailModule, TechnologyCategoryModule, TechnologyToolModule, EmployeeModule, EmailModule],
})
export class AppModule { }
