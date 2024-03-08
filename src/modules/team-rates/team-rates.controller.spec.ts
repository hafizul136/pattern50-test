import { Test, TestingModule } from '@nestjs/testing';
import { TeamRatesController } from './team-rates.controller';
import { TeamRatesService } from './team-rates.service';

describe('TeamRatesController', () => {
  let controller: TeamRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamRatesController],
      providers: [TeamRatesService],
    }).compile();

    controller = module.get<TeamRatesController>(TeamRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
