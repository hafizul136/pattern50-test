import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { RolesService } from '@modules/roles/roles.service';
import { Model } from 'mongoose';

describe('ClientService', () => {
  let service: ClientService;
  let model: Model<Client>;

  let clientModelMock: any;
  let roleServiceMock: any;

  //veriables
  const createClientDto = {
    "name": "hafiz3"
  };
  const mockClient = { _id: 'validClientId', secret: 'validClientSecret' };
  beforeEach(async () => {
    //mock functions
    clientModelMock = {
      find: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
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

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  describe('validateClientCredentials', () => {
    it('should return client when credentials are valid', async () => {
      // clientModelMock.find.mockResolvedValue(mockClient);
      jest.spyOn(model,'find').mockResolvedValue([mockClient])

      const result = await service.validateClientCredentials('validClientId', 'validClientSecret');

      expect(result).toEqual(mockClient);
    });

    // it('should return null when credentials are invalid', async () => {
    //   clientModelMock.find.mockResolvedValueOnce([]);

    //   const result = await service.validateClientCredentials('invalidClientId', 'invalidClientSecret');

    //   expect(result).toBeNull();
    // });

    // it('should return null when an error occurs', async () => {
    //   clientModelMock.find.mockRejectedValueOnce(new Error());

    //   const result = await service.validateClientCredentials('validClientId', 'validClientSecret');

    //   expect(result).toBeNull();
    // });
  });

  // describe('create', () => {
  //   it('should create a client with a secret', async () => {

  //     const mockClient = { ...createClientDto, secret: 'mockSecret' };
  //     clientModelMock.create.mockResolvedValueOnce(mockClient);

  //     const result = await service.create(createClientDto);

  //     expect(result).toEqual(mockClient);
  //   });

  //   it('should throw an error if client creation fails', async () => {
  //     clientModelMock.create.mockRejectedValueOnce(new Error());
  //     await expect(service.create(createClientDto)).rejects.toThrow(BadRequestException);
  //   });
  // });

  // describe('getSecret', () => {
  //   it('should return a secret', async () => {
  //     const result = await service.getSecret();

  //     expect(typeof result).toBe('string');
  //   });
  // });

  // describe('findAll', () => {
  //   it('should return all clients', async () => {
  //     const mockClients = [{ /* mock client data */ }, { /* mock client data */ }];
  //     clientModelMock.find.mockResolvedValueOnce(mockClients);

  //     const result = await service.findAll();

  //     expect(result).toEqual(mockClients);
  //   });
  // });

  // Add more test cases for other methods as needed...
});
