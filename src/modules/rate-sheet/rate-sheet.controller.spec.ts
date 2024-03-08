import { Test, TestingModule } from '@nestjs/testing';
import { RateSheetController } from './rate-sheet.controller';
import { RateSheetService } from './rate-sheet.service';

describe('RateSheetController', () => {
  let controller: RateSheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateSheetController],
      providers: [RateSheetService],
    }).compile();

    controller = module.get<RateSheetController>(RateSheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
