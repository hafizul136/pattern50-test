import { Test, TestingModule } from '@nestjs/testing';
import { RateSheetService } from './rate-sheet.service';

describe('RateSheetService', () => {
  let service: RateSheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateSheetService],
    }).compile();

    service = module.get<RateSheetService>(RateSheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
