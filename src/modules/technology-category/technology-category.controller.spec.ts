import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyCategoryController } from './technology-category.controller';
import { TechnologyCategoryService } from './technology-category.service';

describe('TechnologyCategoryController', () => {
  let controller: TechnologyCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnologyCategoryController],
      providers: [TechnologyCategoryService],
    }).compile();

    controller = module.get<TechnologyCategoryController>(TechnologyCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
