import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Role, RoleSchema } from '@modules/role/entities/role.entity';
import { RoleService } from '@modules/role/role.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client, ClientSchema } from './entities/client.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientService, RoleService, PermissionsService]
})
export class ClientModule { }
