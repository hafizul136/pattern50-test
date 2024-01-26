import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model, connect } from "mongoose";
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { MongoMemoryServer } from "mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { Permission, PermissionSchema } from './entities/permission.entity';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let permissionModel: Model<Permission>;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    permissionModel = mongoConnection.model(Permission.name, PermissionSchema);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [PermissionsService, { provide: getModelToken(Permission.name), useValue: permissionModel }],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
