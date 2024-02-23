import { DatabaseService } from '@modules/db/database.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeRoleController } from './employee-role.controller';
import { EmployeeRoleService } from './employee-role.service';
import { EmployeeRole, employeeRoleSchema } from './entities/employee-role.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeRole.name, schema: employeeRoleSchema },
    ])],
  controllers: [EmployeeRoleController],
  providers: [EmployeeRoleService, DatabaseService],
})
export class EmployeeRoleModule { }
