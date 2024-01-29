import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Permission } from '../permissions/entities/permission.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { RolePermission } from './entities/role-permission.entity';
import { RolePermissionService } from './role-permission.service';

describe('RolePermissionService', () => {
  let service: RolePermissionService;
  let model: Model<RolePermission>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolePermissionService,
        {
          provide: getModelToken(RolePermission.name), useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        PermissionsService,
        {
          provide: getModelToken(Permission.name), useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        RolesService,
        {
          provide: getModelToken(Role.name), useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RolePermissionService>(RolePermissionService);
    model = module.get<Model<RolePermission>>(getModelToken(RolePermission.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create user", () => {
    it('should create a user', async () => {
      const permissionDto = {
        "permissionId": "650180a2087ee9519412427e",
        "roleId": "65018095087ee9519412427c",
        "clientId": "650307ae3b81447e5d793425",
      }
      const permission: any = {
        "_id": "65015e54ebda28d46386cc73",
        "permissionId": "650180a2087ee9519412427e",
        "roleId": "65018095087ee9519412427c",
        "clientId": "650307ae3b81447e5d793425",
        "created_at": "2023-09-13T07:01:40.740+00:00",
        "updated_at": "2023-09-13T07:01:40.740+00:00",
        "__v": 0
      }

      jest.spyOn(model, "create").mockImplementationOnce(() => Promise.resolve(permission))

      await service.create(
        permissionDto as CreateRolePermissionDto
      )


    })
  })
});
