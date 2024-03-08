import { StatusEnum } from '@common/enums/status.enum';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { Utils } from '@common/helpers/utils';
import { TechnologyCategory } from '@modules/technology-category/entities/technology-category.entity';
import { ToolType } from '@modules/technology-category/entities/tool-type.entity';
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
            findOne: jest.fn().mockResolvedValueOnce({
              "_id": "65e6ffd2d012b3bbfd1f01ee",
              "name": "AQS",
              "website": "https://www.aws.com/",
              "logo": "https://pattern50.s3.amazonaws.com/6dfdf72b-85f1-46fa-8587-5a701cbb00d2",
              "status": "active",
              "categoryId": "65defa6da6823419f7d45f51",
              "typeId": "65defec2bc66fa021e8930b4",
              "created_at": "2024-03-05T11:19:46.284Z",
              "updated_at": "2024-03-07T07:29:39.875Z",
              "__v": 0,
              "type": "Cloud Server"
            }),
            validateToolObject: jest.fn(),
            findByIdAndUpdate: jest.fn().mockResolvedValueOnce({
              "_id": "65e6ffd2d012b3bbfd1f01ee",
              "name": "AQS",
              "website": "https://www.aws.com/",
              "logo": "https://pattern50.s3.amazonaws.com/6dfdf72b-85f1-46fa-8587-5a701cbb00d2",
              "status": "active",
              "categoryId": "65defa6da6823419f7d45f51",
              "typeId": "65defec2bc66fa021e8930b4",
              "created_at": "2024-03-05T11:19:46.284Z",
              "updated_at": "2024-03-07T07:29:39.875Z",
              "__v": 0,
              "type": "Cloud Server"
            }),
          },
        },
        {
          provide: getModelToken(TechnologyCategory.name),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(ToolType.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TechnologyToolService>(TechnologyToolService);
    technologyCategoryService = module.get<TechnologyCategoryService>(
      TechnologyCategoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateToolObject', () => {
    const demoTool = {
      name: 'AQS',
      typeId: '65defec2bc66fa021e8930b4',
      categoryId: '65defa6da6823419f7d45f51',
      website: 'https://www.aws.com/',
      logo: 'https://pattern50.s3.amazonaws.com/6dfdf72b-85f1-46fa-8587-5a701cbb00d2',
    };

    const mockToolType: any = {
      name: "Cloud Server",
      status: StatusEnum.ACTIVE,
    };
    const category: any = {
      name: "Cloud Server",
      status: StatusEnum.ACTIVE,
    };

    const mockTool: any = {
      name: "AQS",
      website: "https://www.aws.com/",
      logo: "https://pattern50.s3.amazonaws.com/6dfdf72b-85f1-46fa-8587-5a701cbb00d2",
      status: StatusEnum.ACTIVE,
      type: mockToolType,
      category: category
    };

    it('should update a tool', async () => {
      jest.spyOn(service, 'findOne').mockImplementationOnce(async () => mockTool);

      jest.spyOn(service, 'validateToolObject').mockImplementationOnce(async () => { });
      jest.spyOn(Utils, "isEqualIds").mockReturnValueOnce(true);
      jest.spyOn(ConstructObjectFromDtoHelper, "constructToolsObj").mockReturnValueOnce({
        "name": "AQS",
        "website": "https://www.aws.com/",
        "logo": "https://pattern50.s3.amazonaws.com/6dfdf72b-85f1-46fa-8587-5a701cbb00d2",
        "status": StatusEnum.ACTIVE,
        "categoryId": "65defa6da6823419f7d45f51",
        "typeId": "65defec2bc66fa021e8930b4"
      });

      await service.update("a56sd4fas4df65a4sdf64as6", demoTool);

      expect(service.findOne).toHaveBeenCalledWith("a56sd4fas4df65a4sdf64as6");
      expect(service.validateToolObject).toHaveBeenCalledWith(demoTool);
      expect(Utils.isEqualIds).toHaveReturnedWith(true);
    });
  });
});
