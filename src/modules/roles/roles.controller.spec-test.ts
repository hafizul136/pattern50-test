// import { Test, TestingModule } from '@nestjs/testing';
// import { RolesController } from './roles.controller';
// import { RolesService } from './roles.service';
// import { Role, RoleSchema } from './entities/role.entity';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { Connection, Model, connect } from 'mongoose';
// import { getModelToken } from '@nestjs/mongoose';

// describe('RolesController', () => {
//   let controller: RolesController;
//   let mongod: MongoMemoryServer;
//   let mongoConnection: Connection;
//   let roleModel: Model<Role>;

//   beforeEach(async () => {
//     mongod = await MongoMemoryServer.create();
//     const uri = mongod.getUri();
//     mongoConnection = (await connect(uri)).connection;
//     roleModel = mongoConnection.model(Role.name, RoleSchema);
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [RolesController],
//       providers: [RolesService, { provide: getModelToken(Role.name), useValue: roleModel }],
//     }).compile();

//     controller = module.get<RolesController>(RolesController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
