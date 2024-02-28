import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyCategoryService } from './technology-category.service';

describe('TechnologyCategoryService', () => {
  let service: TechnologyCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnologyCategoryService],
    }).compile();

    service = module.get<TechnologyCategoryService>(TechnologyCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
