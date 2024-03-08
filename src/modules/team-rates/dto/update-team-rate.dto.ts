import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamRateDto } from './create-team-rate.dto';

export class UpdateTeamRateDto extends PartialType(CreateTeamRateDto) {}
