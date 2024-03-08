import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateTeamRateDto } from './dto/update-team-rate.dto';
import { TeamRate, TeamRateDocument } from './entities/team-rate.entity';

@Injectable()
export class TeamRatesService {
  constructor(
    @InjectModel(TeamRate.name)
    private readonly teamRateModel: Model<TeamRateDocument>
  ) { }

  // create team rates in bulk
  async createTeamRates(teamRatesObjects: any[], session: any) {
    try {
      const teamRates = await this.teamRateModel.create(teamRatesObjects, { session });
      return teamRates;
    } catch (err) {
      ExceptionHelper.getInstance().defaultError(
        err?.message,
        err?.code,
        HttpStatus.BAD_REQUEST
      )
    }
  }

  findAll() {
    return `This action returns all teamRates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teamRate`;
  }

  update(id: number, updateTeamRateDto: UpdateTeamRateDto) {
    return `This action updates a #${id} teamRate`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamRate`;
  }
}
