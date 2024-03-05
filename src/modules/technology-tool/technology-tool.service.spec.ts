import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { TechnologyTool } from './entities/technology-tool.entity';
import { TechnologyToolService } from './technology-tool.service';

describe('TechnologyToolService', () => {
  let service: TechnologyToolService;
  let model: Model<TechnologyTool>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnologyToolService, {
        provide: getModelToken(TechnologyTool.name),
        useValue: {
          create: jest.fn(),
        }
      }],
    }).compile();

    service = module.get<TechnologyToolService>(TechnologyToolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
