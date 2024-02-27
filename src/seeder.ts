import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Role, RoleSchema } from '@modules/role/entities/role.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from 'configuration/app.config';
import { seeder } from 'nestjs-seeder';
import { AuthSeeder } from 'seeders/auth.seeder';



seeder({
    imports: [
        MongooseModule.forRoot(`${appConfig.mongodbURL}${appConfig.serverType}pattern50db`),
        MongooseModule.forFeature([
            { name: Role.name, schema: RoleSchema },
            { name: Permission.name, schema: PermissionSchema },
            { name: RolePermission.name, schema: RolePermissionSchema },
        ]),
    ],
}).run([AuthSeeder]);