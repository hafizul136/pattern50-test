// import { Test, TestingModule } from '@nestjs/testing';
// import { CompanyAddressController } from './companyAddress.controller';
// import { CompanyAddressService } from './companyAddress.service';
// import { CompanyAddress, CompanyAddressSchema } from './entities/companyAddress.entity';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { Connection, Model, connect } from 'mongoose';
// import { getModelToken } from '@nestjs/mongoose';

// describe('AddressController', () => {
//   let controller: CompanyAddressController;
//   let mongod: MongoMemoryServer;
//   let mongoConnection: Connection;
//   let companyAddressModel: Model<CompanyAddress>;

//   beforeEach(async () => {
//     mongod = await MongoMemoryServer.create();
//     const uri = mongod.getUri();
//     mongoConnection = (await connect(uri)).connection;
//     companyAddressModel = mongoConnection.model(CompanyAddress.name, CompanyAddressSchema);
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [CompanyAddressController],
//       providers: [CompanyAddressService, { provide: getModelToken(CompanyAddress.name), useValue: companyAddressModel }],
//     }).compile();

//     controller = module.get<CompanyAddressController>(CompanyAddressController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
