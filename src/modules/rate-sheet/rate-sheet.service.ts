import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { DatabaseService } from '@modules/db/database.service';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { TeamRatesService } from '@modules/team-rates/team-rates.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateRateSheetDto } from './dto/create-rate-sheet.dto';
import { UpdateRateSheetDto } from './dto/update-rate-sheet.dto';
import { RateSheet, RateSheetDocument } from './entities/rate-sheet.entity';
import { AggregationHelper } from '@common/helpers/aggregation.helper';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Utils } from '@common/helpers/utils';
import { IRateSheet } from './interfaces/ratesheet.interface';

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



  async getRateSheets(query: { page: string, size: string, query?: string }, user: IUser): Promise<{ data?: IRateSheet[], count?: number }> {
    let aggregate = [];
    let page: number = parseInt(query?.page), size: number = parseInt(query?.size);
    if (!query?.page || parseInt(query?.page) < 1) page = 1;
    if (!query?.size || parseInt(query?.size) < 1) size = 10;

    // filter by client id
    AggregationHelper.filterByMatchAndQueriesAll(aggregate, [{ clientId: new mongoose.Types.ObjectId(user?.clientId) }]);

    AggregationHelper.lookupForIdForeignKey(aggregate, "teamrates", "teamrates", "teamRates");
    // AggregationHelper.unwindWithPreserveNullAndEmptyArrays(aggregate, "employeeRoles");

    // searching by 
    let trimmedQuery = null;
    if (query.query) {
      trimmedQuery = query.query.trim();
    }

    if (trimmedQuery) {

      const escapedQuery = trimmedQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      aggregate.push({
        $match: {
          $or: [
            {
              name: { $regex: escapedQuery, $options: "i" }
            },
            // { email: { $regex: escapedQuery, $options: "i" } },
            // { "employeeRoles.name": { $regex: escapedQuery, $options: "i" } },
          ]
        }
      });
    }

    AggregationHelper.getCountAndDataByFacet(aggregate, +page, +size);

    const companies = await this.rateSheetModel.aggregate(aggregate).exec();

    return Utils.returnListResponse(companies);
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
