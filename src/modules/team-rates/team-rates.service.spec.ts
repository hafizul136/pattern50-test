import { Test, TestingModule } from '@nestjs/testing';
import { TeamRatesService } from './team-rates.service';

describe('TeamRatesService', () => {
  let service: TeamRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamRatesService],
    }).compile();

    service = module.get<TeamRatesService>(TeamRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
