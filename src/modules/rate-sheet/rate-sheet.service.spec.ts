import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { Utils } from '@common/helpers/utils';
import { DatabaseService } from '@modules/db/database.service';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { TeamRatesService } from '@modules/team-rates/team-rates.service';
import { UserTypeEnum } from '@modules/users/enum/index.enum';
import { IUser } from '@modules/users/interfaces/user.interface';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { RateSheet } from './entities/rate-sheet.entity';
import { RateSheetService } from './rate-sheet.service';

describe('RateSheetService', () => {
  // mock values
  const user: IUser = {
    userId: MongooseHelper.getInstance().makeMongooseId('65d6e59bd2d038abc102b4dc'),
    userType: UserTypeEnum.admin,
    clientId: MongooseHelper.getInstance().makeMongooseId('65d6e54dd2d038abc102b4b2'),
    email: 'pattern50test@gmail.com',
    firstName: 'pattern50',
    lastName: 'test',
    stripeCustomerId: ''
  } as IUser;


  const rateSheetListRes = {
    "data": [
      {
        "_id": "65eeb7a57c5a7ca8c3594167",
        "name": "Rate Sheet 002",
        "startDate": "2024-03-11T07:49:57.676Z",
        "endDate": null,
        "status": "active",
        "created_at": "2024-03-11T07:49:57.677Z",
        "updated_at": "2024-03-11T07:49:57.677Z",
        "roleCount": 3,
        "assignCompanyCount": 0
      },
      {
        "_id": "65eeb7917c5a7ca8c359415d",
        "name": "Rate Sheet 002",
        "startDate": "2024-03-11T07:49:37.442Z",
        "endDate": null,
        "status": "active",
        "created_at": "2024-03-11T07:49:37.443Z",
        "updated_at": "2024-03-11T07:49:37.443Z",
        "roleCount": 2,
        "assignCompanyCount": 0
      }
    ],
    "count": 5
  }

  let service: RateSheetService;
  let model: Model<RateSheet>;
  let aggregateMock: jest.Mock;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateSheetService,
        {
          provide: getModelToken(RateSheet.name),
          useValue: {
            aggregate: jest.fn(),
          },
        },
        {
          provide: EmployeeRoleService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: TeamRatesService,
          useValue: {
          },
        }
      ],
    }).compile();

    service = module.get<RateSheetService>(RateSheetService);
    model = module.get<Model<RateSheet>>(getModelToken(RateSheet.name));
    aggregateMock = model.aggregate as jest.Mock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRateSheets', () => {
    it('should return rate sheets with count of team rates', async () => {
      // Mock input data
      const query = { page: '1', size: '3', query: 'test' };
      // Mock the aggregate method of the model
      aggregateMock.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(rateSheetListRes?.data),
      });
      // Mock Utils.returnListResponse function
      const returnListResponseMock = jest.spyOn(Utils, 'returnListResponse');
      const mockedResponse = { data: rateSheetListRes?.data, count: rateSheetListRes?.count }; // Mocked response
      returnListResponseMock.mockReturnValueOnce(mockedResponse);
      // Call the function and await the result
      const result = await service.getRateSheets(query, user);
      console.log({ result: JSON.stringify(result) });
      // Verify the result
      expect(result).toBeDefined();
      expect(result).toEqual(rateSheetListRes);
      expect(model.aggregate).toHaveBeenCalledWith(expect.any(Array));
    });


    it('should return rate sheets with count  and data property', async () => {
      // Mock input data
      const query = { page: '1', size: '3', query: 'test' };
      // Mock the aggregate method of the model
      aggregateMock.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(rateSheetListRes?.data),
      });
      // Mock Utils.returnListResponse function
      const returnListResponseMock = jest.spyOn(Utils, 'returnListResponse');
      const mockedResponse = { data: rateSheetListRes?.data, count: rateSheetListRes?.count }; // Mocked response
      returnListResponseMock.mockReturnValueOnce(mockedResponse);
      // Call the function and await the result
      const result = await service.getRateSheets(query, user);
      console.log({ result: JSON.stringify(result) });
      // Verify the result
      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining({
        data: expect.any(Array),
        count: expect.any(Number), // Check that count property is present and is a number
      }));
      expect(model.aggregate).toHaveBeenCalledWith(expect.any(Array));
    });
  });

});
