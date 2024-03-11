import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { AggregationHelper } from '@common/helpers/aggregation.helper';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { Utils } from '@common/helpers/utils';
import { DatabaseService } from '@modules/db/database.service';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { TeamRatesService } from '@modules/team-rates/team-rates.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateRateSheetDto } from './dto/create-rate-sheet.dto';
import { UpdateRateSheetDto } from './dto/update-rate-sheet.dto';
import { RateSheet, RateSheetDocument } from './entities/rate-sheet.entity';
import { IRateSheetPagination } from './interfaces/rate-sheet.interface';

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

  async getRateSheets(query: { page: string, size: string, query?: string }, user: IUser): Promise<IRateSheetPagination> {
    let aggregate = [];
    let page: number = parseInt(query?.page), size: number = parseInt(query?.size);
    if (!query?.page || parseInt(query?.page) < 1) page = 1;
    if (!query?.size || parseInt(query?.size) < 1) size = 10;

    // filter by client id
    AggregationHelper.filterByMatchAndQueriesAll(aggregate, [{ clientId: new mongoose.Types.ObjectId(user?.clientId) }]);
    AggregationHelper.lookupForIdLocalKey(aggregate, "teamrates", "rateSheetId", "teamRates")

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
            }
          ]
        }
      });
    }
    aggregate.push({
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        startDate: { $first: '$startDate' },
        endDate: { $first: '$endDate' },
        status: { $first: '$status' },
        created_at: { $first: '$created_at' },
        updated_at: { $first: '$updated_at' },
        // teamRates: { $first: '$teamRates' } ,
        roleCount: { $sum: { $size: '$teamRates' } }
      }
    })
    aggregate.push({
      $addFields: {
        assignCompanyCount: { $literal: 0 } // TODO: Need to when contact will be added
      }
    })

    AggregationHelper.getCountAndDataByFacet(aggregate, +page, +size);
    const companies = await this.rateSheetModel.aggregate(aggregate).exec();
    console.log({ companies})
    return Utils.returnListResponse(companies);

  }

  async findOne(id: string) {
    MongooseHelper.getInstance().isValidMongooseId(id);

    const rateSheet = await this.rateSheetModel.findById(id);

    if (NestHelper.getInstance().isEmpty(rateSheet)) {
      ExceptionHelper.getInstance().defaultError(
        "No rateSheet found",
        "rateSheet_not_found",
        HttpStatus.NOT_FOUND
      )
    }

    return rateSheet;
  }

  // toggle active/inactive
  async update(id: string, updateRateSheetDto: UpdateRateSheetDto, user: IUser) {
    // validate if role exists by the id
    const rateSheet = await this.findOne(id);

    if (!(rateSheet?.clientId).equals(user?.clientId)) {

      ExceptionHelper.getInstance().defaultError(
        `You cannot update this rateSheet`,
        "forbidden",
        HttpStatus.BAD_REQUEST
      );
    }

    if (rateSheet?.status === updateRateSheetDto?.status) {
      ExceptionHelper.getInstance().defaultError(
        `Rate Sheet already ${rateSheet.status}`,
        "conflicts",
        HttpStatus.BAD_REQUEST
      );
    }

    const updatedSheet = await this.rateSheetModel.findByIdAndUpdate(id, { status: updateRateSheetDto.status.trim() }, { new: true });

    return updatedSheet;
  }

  remove(id: number) {
    return `This action removes a #${id} rateSheet`;
  }
}
