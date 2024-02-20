import { Test, TestingModule } from '@nestjs/testing';
import { BillingInfoController } from './billing-info.controller';
import { BillingInfoService } from '../services/billing-info.service';

describe('BillingInfoController', () => {
  let controller: BillingInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingInfoController],
      providers: [BillingInfoService],
    }).compile();

    controller = module.get<BillingInfoController>(BillingInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
