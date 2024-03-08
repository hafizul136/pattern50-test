import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UpdateTeamRateDto } from './dto/update-team-rate.dto';
import { TeamRatesService } from './team-rates.service';

@Controller('team-rates')
export class TeamRatesController {
  constructor(private readonly teamRatesService: TeamRatesService) { }

  // @Post()
  // create(@Body() createTeamRateDto: CreateTeamRateDto) {
  //   // return this.teamRatesService.create(createTeamRateDto);
  // }

  @Get()
  findAll() {
    return this.teamRatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamRatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamRateDto: UpdateTeamRateDto) {
    return this.teamRatesService.update(+id, updateTeamRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamRatesService.remove(+id);
  }
}
