import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamRate, TeamRateSchema } from './entities/team-rate.entity';
import { TeamRatesController } from './team-rates.controller';
import { TeamRatesService } from './team-rates.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamRate.name, schema: TeamRateSchema }
    ])
  ],
  controllers: [TeamRatesController],
  providers: [TeamRatesService],
})
export class TeamRatesModule { }
