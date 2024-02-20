import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { RolesService } from '@modules/roles/roles.service';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';

describe('ClientService', () => {
  let service: ClientService;
  let model: Model<Client>;

  let clientModelMock: any;
  let roleServiceMock: any;

  //veriables
  const createClientDto = {
    "name": "hafiz3"
  };
  const invalidClientId = new mongoose.Types.ObjectId("65bb300e7f35352a117b9088")
  const mockClient = {
    "_id": new mongoose.Types.ObjectId("65bb300e7f35352a117b90f7"),
    "name": "pattern50",
    "status": "active",
    "secret": "fed34de4-0a29-43f4-8e5b-7ef5cb65fabf",
    "marketPlacePayment": false,
    "created_at": {
      "$date": "2024-02-01T05:45:50.821Z"
    },
    "updated_at": {
      "$date": "2024-02-01T05:45:50.821Z"
    },
    "__v": 0
  };
  const mockClients = [mockClient]
  beforeEach(async () => {
    //mock functions
    const leanMock = jest.fn().mockImplementation(() => mockClient);
    const execMock = jest.fn().mockImplementation(() => [mockClient]);
    clientModelMock = {
      find: jest.fn().mockImplementation((id: mongoose.Types.ObjectId) => {
        return { exec: execMock }; // Return an object with a lean method
      }),
      create: jest.fn(),
      findById: jest.fn().mockImplementation((id: mongoose.Types.ObjectId) => {
        if (id.equals(mockClient?._id)) {
          return { lean: leanMock }; // Return an object with a lean method
        } else {
          return null; // Simulate client not found
        }
      }),
      findByIdAndUpdate: jest.fn(),
    };

    roleServiceMock = {
      createRolesAndAddPermission: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: getModelToken(Client.name), useValue: clientModelMock },
        { provide: RolesService, useValue: roleServiceMock },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    model = module.get<Model<Client>>(getModelToken(Client.name));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findOne', () => {
    it('should return a client when a valid ID is provided', async () => {
      const foundClient = await service.findOne(mockClient?._id);
      expect(foundClient).toEqual(mockClient);
      expect(clientModelMock.findById).toHaveBeenCalledWith(mockClient?._id);
    });

    it('should throw an error when an invalid ID is provided', async () => {
      await expect(service.findOne(invalidClientId)).rejects.toThrowError();
      expect(clientModelMock.findById).toHaveBeenCalledWith(invalidClientId);
    });
  });
  describe('isValidMongooseId', () => {

    it('should not throw an error when a valid ObjectId is provided', async () => {
      const validId = new mongoose.Types.ObjectId('65bb300e7f35352a117b90f7');
      await expect(MongooseHelper.getInstance().isValidMongooseId(validId)).resolves.not.toThrow();
    });

    it('should throw an error when an invalid ID is provided', async () => {
      const invalidId = 'invalid-id';
      await expect(MongooseHelper.getInstance().isValidMongooseId(invalidId)).rejects.toThrowError();
    });
  });
  describe('getClientById', () => {
    it('should return a client when a valid ID is provided', async () => {
      const result = await service.getClientById(mockClient?._id);
      expect(result).toEqual(mockClient);
      expect(clientModelMock.findById).toHaveBeenCalledWith(mockClient?._id);
    });
  });
  describe('findAll', () => {
    it('should return all clients', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockClients);
      expect(clientModelMock.find).toHaveBeenCalled(); // Ensure that the find method was called
    });
  });

});
