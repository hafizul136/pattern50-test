import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client, ClientSchema } from './entities/client.entity';
import { RolesService } from '@modules/roles/roles.service';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { Role, RoleSchema } from '@modules/roles/entities/role.entity';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';

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
  providers: [ClientService, RolesService, PermissionsService]
})
export class ClientModule { }
