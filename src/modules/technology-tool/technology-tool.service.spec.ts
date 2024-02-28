import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyToolService } from './technology-tool.service';

describe('TechnologyToolService', () => {
  let service: TechnologyToolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnologyToolService],
    }).compile();

    service = module.get<TechnologyToolService>(TechnologyToolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
