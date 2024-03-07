import { TechnologyCategory } from '@modules/technology-category/entities/technology-category.entity';
import { ToolType } from '@modules/technology-category/entities/tool-type.entity';
import { ITechnologyCategory } from '@modules/technology-category/interfaces/technology-category.interface';
import { IToolType } from '@modules/technology-category/interfaces/tool-type.interface';
import { TechnologyCategoryService } from '@modules/technology-category/technology-category.service';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { TechnologyTool } from './entities/technology-tool.entity';
import { TechnologyToolService } from './technology-tool.service';

describe('TechnologyToolService', () => {
  let service: TechnologyToolService;
  let technologyCategoryService: TechnologyCategoryService;
  let model: Model<TechnologyTool>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnologyToolService,
        TechnologyCategoryService,
        {
          provide: getModelToken(TechnologyTool.name),
          useValue: {
            create: jest.fn(),
          }
        },
        {
          provide: getModelToken(TechnologyCategory.name),
          useValue: {
            create: jest.fn(),
          }
        },
        {
          provide: getModelToken(ToolType.name),
          useValue: {
            create: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<TechnologyToolService>(TechnologyToolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateToolObject', () => {
    const demoTool = {
      "name": "AQS",
      "typeId": "65defec2bc66fa021e8930b4",
      "categoryId": "65defa6da6823419f7d45f51",
      "website": "https://www.aws.com/",
      "logo": "https://pattern50.s3.amazonaws.com/6dfdf72b-85f1-46fa-8587-5a701cbb00d2"
    }

    it('should validate tool object', async () => {
      jest.spyOn(technologyCategoryService, 'findOne').mockResolvedValueOnce({} as ITechnologyCategory);
      jest.spyOn(technologyCategoryService, 'findOneToolType').mockResolvedValueOnce({} as IToolType);

      await expect(service.validateToolObject(demoTool)).resolves.toBeUndefined();
    });
  })

});
