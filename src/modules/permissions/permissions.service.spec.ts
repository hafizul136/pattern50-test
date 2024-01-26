import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';


describe('PermissionsService', () => {
  let service: PermissionsService;
  let model: Model<Permission>;
  const demoUser = {
    "_id": "6502c85a9817005ad7e0a071",
    "firstName": "pattern50 ev",
    "lastName": "company admin",
    "email": "pattern50_company@gmail.com",
    "userRoleId": "6501902d2f99c0a2f71035bd",
    "verificationCode": "",
    "registrationType": "password",
    "userType": "admin",
    "status": "active",
    "clientId": "6503e701e73ad0bcc5536edd",
    "isRegistered": true,
    "isVerified": false,
    "isDeleted": false,
    "lastLogin": "2023-09-15T05:56:59.086Z",
    "created_at": "2023-09-14T08:46:18.961Z",
    "updated_at": "2023-09-14T08:46:18.961Z",
    "__v": 0,
    "scopes": []
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getModelToken(Permission.name), useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          }
        }],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    model = module.get<Model<Permission>>(getModelToken(Permission.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new permission", async () => {
      const createPermissionDto = {
        name: "role.create",
        status: "active",
        details: "admin role",
        clientId: "test_client_id",
      }

      const createPermissionMock: any = {
        _id: new mongoose.Types.ObjectId("61c0ccf11d7bf83d153d7c06"),
        name: "role.create",
        status: "active",
        details: "admin role",
        clientId: "test_client_id",
      }

      jest.spyOn(model, "create").mockImplementationOnce(() => Promise.resolve(createPermissionMock))

      const result = await service.create(
        createPermissionDto as CreatePermissionDto
      );

      expect(result).toEqual(createPermissionMock);
    })
  })

  describe('findOne', () => {
    it("Should return a permission object", async () => {
      const id = "61c0ccf11d7bf83d153d7c06";
      const PermissionMock: any = {
        _id: "61c0ccf11d7bf83d153d7c06",
        name: "role.create",
        status: "active",
        details: "admin role",
        clientId: "test_client_id",
      }
      const mockQuery: any = {
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(PermissionMock)
      };
      jest.spyOn(model, 'findOne').mockReturnValue(mockQuery);

      const result = await service.findOne(id);
      // expect(service.findOne).toHaveBeenCalledWith({ _id: id });
      expect(result).toEqual(PermissionMock)
    })

    it("Should throw an exception when id is empty", async () => {
      const id = "61c0ccf11d7bf83d153d7c06";

      await expect(service.findOne("")).rejects.toThrowError();
    })

    it("Should throw an exception when id is not an valid mongodb object", async () => {
      const id = "61c0ccf11d7bf83d153d7c06";
      await expect(service.findOne(id)).rejects.toThrowError();
    })
  })

  describe('findAllByIds', () => {
    it("should return all permission by ids", async () => {
      const ids = {
        "permissionIds": [
          "61c0ccf11d7bf83d153d7c06",
          "61c0ccf11d7bf83d153d7c07"
        ]
      };

      const PermissionsMock: any = [
        {
          _id: "61c0ccf11d7bf83d153d7c06",
          name: "role.create",
          status: "active",
          details: "admin role",
          clientId: "test_client_id",
        }
      ]
      const mockQuery: any = {
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(PermissionsMock)
      };
      jest.spyOn(model, 'find').mockReturnValueOnce(mockQuery);
      const result = await service.findAllByIds(ids, demoUser);
      expect(result).toEqual(PermissionsMock);
    })

    it("should throw exception when client id is empty", async () => {
      const ids = {
        "permissionIds": [
          "61c0ccf11d7bf83d153d7c06",
          "61c0ccf11d7bf83d153d7c07"
        ]
      };

      const PermissionsMock: any = [
        {
          _id: "61c0ccf11d7bf83d153d7c06",
          name: "role.create",
          status: "active",
          details: "admin role",
          clientId: "test_client_id",
        }
      ]
      const mockQuery: any = {
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(PermissionsMock)
      };
      jest.spyOn(model, 'find').mockReturnValueOnce(mockQuery);
      demoUser.clientId = "";
      expect(service.findAllByIds(ids, demoUser)).rejects.toThrowError();
    })

    it("should throw error when permission creation fails with invalid mongo ids", async () => {
      const ids = {
        "permissionIds": [
          "61c0ccf11d7bf83",
          "61c0ccf11d7bf"
        ]
      };

      const PermissionsMock: any = [
        {
          _id: "61c0ccf11d7bf83d153d7c06",
          name: "role.create",
          status: "active",
          details: "admin role",
          clientId: "test_client_id",
        }
      ]
      const mockQuery: any = {
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(PermissionsMock)
      };
      jest.spyOn(model, 'find').mockReturnValueOnce(mockQuery);
      expect(service.findAllByIds(ids, demoUser)).rejects.toThrowError();
    })
  })

});
