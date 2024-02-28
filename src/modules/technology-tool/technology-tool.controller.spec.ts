import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyToolController } from './technology-tool.controller';
import { TechnologyToolService } from './technology-tool.service';

describe('TechnologyToolController', () => {
  let controller: TechnologyToolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnologyToolController],
      providers: [TechnologyToolService],
    }).compile();

    controller = module.get<TechnologyToolController>(TechnologyToolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
