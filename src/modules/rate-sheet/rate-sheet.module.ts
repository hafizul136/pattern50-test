import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { EmployeeRole, employeeRoleSchema } from '@modules/employee-role/entities/employee-role.entity';
import { TeamRate, TeamRateSchema } from '@modules/team-rates/entities/team-rate.entity';
import { TeamRatesService } from '@modules/team-rates/team-rates.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RateSheet, RateSheetSchema } from './entities/rate-sheet.entity';
import { RateSheetController } from './rate-sheet.controller';
import { RateSheetService } from './rate-sheet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RateSheet.name, schema: RateSheetSchema },
      { name: EmployeeRole.name, schema: employeeRoleSchema },
      { name: TeamRate.name, schema: TeamRateSchema }
    ])
  ],
  controllers: [RateSheetController],
  providers: [
    RateSheetService,
    EmployeeRoleService,
    TeamRatesService
  ],
})
export class RateSheetModule { }
