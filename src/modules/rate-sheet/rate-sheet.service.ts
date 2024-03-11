import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { DatabaseService } from '@modules/db/database.service';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { TeamRatesService } from '@modules/team-rates/team-rates.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRateSheetDto } from './dto/create-rate-sheet.dto';
import { UpdateRateSheetDto } from './dto/update-rate-sheet.dto';
import { RateSheet, RateSheetDocument } from './entities/rate-sheet.entity';

@Injectable()
export class RateSheetService {
  constructor(
    @InjectModel(RateSheet.name)
    private readonly rateSheetModel: Model<RateSheetDocument>,
    private readonly employeeRoleService: EmployeeRoleService,
    private databaseService: DatabaseService,
    private readonly teamRateService: TeamRatesService
  ) { }

  async create(createRateSheetDto: CreateRateSheetDto, user: IUser) {
    const session = await this.databaseService.startSession();
    let rateSheet, teamStructures;
    await session.withTransaction(async () => {
      // construct object
      const rateSheetObj = ConstructObjectFromDtoHelper.constructRateSheetObj(createRateSheetDto, user);

      // create rate sheet
      rateSheet = await this.rateSheetModel.create([rateSheetObj], { session });

      // make it object
      const createdSheetObj = rateSheet[0]?.toObject();

      // process team structures
      const teamStructureObjs = await Promise.all(createRateSheetDto?.teamStructures?.map(async structure => {
        // validate role id
        await this.employeeRoleService.findOne(structure?.role);

        // construct object
        return ConstructObjectFromDtoHelper.constructTeamStructureObj(structure, createdSheetObj?._id?.toString());
      }));

      teamStructures = await this.teamRateService.createTeamRates(teamStructureObjs, session);
    })
    session.endSession();

    return {
      rateSheet: rateSheet?.length ? rateSheet[0] : [],
      roles: teamStructures
    };
  }



  findAll() {
    return `This action returns all rateSheet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rateSheet`;
  }

  // toggle active/inactive
  async update(id: number, updateRateSheetDto: UpdateRateSheetDto) {
    // validate if role exists by the id
    // const rateSheet = await this.findOne(id);

    // if (rateSheet?.status === updateEmployeeRoleDto?.status) {
    //   ExceptionHelper.getInstance().defaultError(
    //     `Role already ${employeeRole.status}`,
    //     "conflicts",
    //     HttpStatus.BAD_REQUEST
    //   );
    // }

    // const updatedRole = await this.employeeRoleModel.findByIdAndUpdate(id, { status: updateEmployeeRoleDto.status.trim() }, { new: true });

    // return updatedRole;
  }

  remove(id: number) {
    return `This action removes a #${id} rateSheet`;
  }
}
