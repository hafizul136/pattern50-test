import { Test, TestingModule } from '@nestjs/testing';
import { CompanyAddressService } from './company-address.service';

describe('CompanyAddressService', () => {
  let service: CompanyAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyAddressService],
    }).compile();

    service = module.get<CompanyAddressService>(CompanyAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
